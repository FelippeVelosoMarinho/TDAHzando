// chordsParser.js

/**
 * Peso dos acordes baseado na dificuldade.
 * 1: Muito Fácil
 * 2: Fácil
 * 3: Médio (Pestanas Básicas)
 * 4: Intermediário/Avançado
 * 5: Difícil (Jazz/Extensões)
 */
function getChordWeight(chordName, positions) {
    if (chordName.includes('13') || chordName.includes('7M') || chordName.includes('dim')) return 5;
    if (chordName.includes('m7b5') || chordName.includes('aug')) return 4;
    
    // Simplificação de pestanas (analisando o número de dedos ou X na posição)
    // Se a posição não usa cordas soltas (exceção 0), provavelmente tem pestana
    const hasOpenStrings = positions.includes('0');
    if (!hasOpenStrings && !chordName.includes('m') && chordName.length > 1) return 3;

    if (chordName.length > 2) return 2; // Acordes menores, com sétima etc
    return 1; // Acordes maiores simples
}

function calculateDifficulty(chordsDict) {
    const uniqueChords = Object.keys(chordsDict);
    if (uniqueChords.length === 0) return { score: 0, level: 'Iniciante' };

    let totalWeight = 0;
    uniqueChords.forEach(chord => {
        totalWeight += getChordWeight(chord, chordsDict[chord]);
    });

    const averageWeight = totalWeight / uniqueChords.length;
    // Modulações de tom não estão implementadas nesta versão simplificada, assumimos 0
    const modulations = 0; 

    const score = (averageWeight * 0.6) + (uniqueChords.length * 0.2) + (modulations * 0.2);

    let level = 'Iniciante (Kit Sobrevivência)';
    if (score > 2.0 && score <= 3.5) level = 'Intermediário';
    else if (score > 3.5) level = 'Avançado';

    return {
        score: score.toFixed(2),
        level,
        uniqueChordsCount: uniqueChords.length
    };
}

/**
 * Faz o parse do arquivo TXT e retorna a estrutura JSON com dicionário e tokens.
 */
function parseChordsFile(fileContent, metadata = {}) {
    const lines = fileContent.split('\n').map(l => l.trimEnd());
    const chordsDict = {};
    const structure = [];

    let isDictionarySection = false;
    let currentSection = 'Intro';
    let sectionLines = [];

    // Regex para identificar dicionário: ex G7M = 3 X 4 4 3 X
    const dictRegex = /([A-G][a-zA-Z0-7#]*)\s*=\s*([\d Xx]+)/g;
    
    // Regex para linha de acordes (contém apenas acordes e espaços)
    const chordLineRegex = /^[\sA-G][A-G]?[a-zA-Z0-7#]*(?:\s+[A-G][a-zA-Z0-7#]*)*\s*$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('--- Acordes ---') || line.includes('----------------- Acordes -----------------')) {
            isDictionarySection = true;
            continue;
        }

        if (isDictionarySection) {
            let match;
            while ((match = dictRegex.exec(line)) !== null) {
                chordsDict[match[1]] = match[2];
            }
            continue;
        }

        // Se for linha de sessão (ex: [Verso 1] ou Intro:)
        if (line.match(/^\[.*\]$/) || line.match(/^[A-Za-z0-9 ]+:$/)) {
            if (sectionLines.length > 0) {
                structure.push({ section: currentSection, lines: sectionLines });
                sectionLines = [];
            }
            currentSection = line.replace(/[\[\]:]/g, '').trim();
            continue;
        }

        if (!line.trim()) continue;

        // Verifica se a linha atual é de acordes
        if (chordLineRegex.test(line)) {
            const nextLine = (i + 1 < lines.length) ? lines[i + 1] : '';
            // Se a próxima linha for de letra, fazemos o "casamento" dos tokens
            if (nextLine.trim() !== '' && !chordLineRegex.test(nextLine)) {
                // Parse dos acordes com seus índices
                const chordMatches = [...line.matchAll(/([A-G][a-zA-Z0-7#]*)/g)];
                const tokens = [];

                for (let j = 0; j < chordMatches.length; j++) {
                    const chordObj = chordMatches[j];
                    const chordStr = chordObj[0];
                    const startIndex = chordObj.index;
                    
                    let endIndex = nextLine.length;
                    if (j + 1 < chordMatches.length) {
                        endIndex = chordMatches[j + 1].index;
                    }

                    const textSegment = nextLine.substring(startIndex, endIndex);
                    tokens.push({ chord: chordStr, text: textSegment });
                }

                // E se houver texto ANTES do primeiro acorde?
                if (chordMatches.length > 0 && chordMatches[0].index > 0) {
                    const leadingText = nextLine.substring(0, chordMatches[0].index);
                    if (leadingText.trim()) {
                        tokens.unshift({ chord: null, text: leadingText });
                    }
                }

                sectionLines.push({ tokens });
                i++; // Pula a próxima linha pois já processamos
            } else {
                // É uma linha de acordes solta (sem letra embaixo)
                const chordMatches = [...line.matchAll(/([A-G][a-zA-Z0-7#]*)/g)];
                const tokens = chordMatches.map(m => ({ chord: m[0], text: '' }));
                sectionLines.push({ tokens });
            }
        } else {
            // Linha apenas de letra
            sectionLines.push({ tokens: [{ chord: null, text: line }] });
        }
    }

    if (sectionLines.length > 0) {
        structure.push({ section: currentSection, lines: sectionLines });
    }

    const difficultyInfo = calculateDifficulty(chordsDict);

    return {
        title: metadata.title || "Unknown Title",
        artist: metadata.artist || "Unknown Artist",
        difficulty: difficultyInfo.level,
        difficultyScore: difficultyInfo.score,
        chords_used: Object.keys(chordsDict),
        chords_dict: chordsDict,
        structure
    };
}

export { parseChordsFile };
