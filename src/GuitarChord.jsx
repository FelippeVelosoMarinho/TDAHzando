import React from 'react';

const GuitarChord = ({ name, positions }) => {
  if (!positions) return <div style={{width: 200, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Sem Posição</div>;

  const posArray = positions.split(' ').map(p => p.toUpperCase());
  // Filtra apenas as posições numéricas maiores que 0 para definir o range de trastes
  const frets = posArray.map(p => parseInt(p)).filter(p => !isNaN(p) && p > 0);
  
  let minFret = frets.length > 0 ? Math.min(...frets) : 1;
  let maxFret = frets.length > 0 ? Math.max(...frets) : 3;

  // Garantir que a janela mostre no mínimo 4 trastes
  if (maxFret - minFret < 3) {
    maxFret = minFret + 3;
  }
  
  // Se começar no traste 1, desenhamos a pestana do nut mais grossa
  const startingFret = minFret > 2 ? minFret : 1;
  const numFretsToDraw = maxFret - startingFret + 1;

  // Dimensões
  const width = 200;
  const height = 250;
  const topPadding = 40;
  const bottomPadding = 20;
  const sidePadding = 30;
  
  const neckWidth = width - (sidePadding * 2);
  const neckHeight = height - topPadding - bottomPadding;
  const stringSpacing = neckWidth / 5;
  const fretSpacing = neckHeight / numFretsToDraw;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{name}</h2>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Draw Nut or Fret number */}
        {startingFret === 1 ? (
          <line x1={sidePadding} y1={topPadding} x2={width - sidePadding} y2={topPadding} stroke="var(--text-primary)" strokeWidth="6" />
        ) : (
          <text x={sidePadding - 15} y={topPadding + (fretSpacing / 2)} fontSize="16" fill="var(--text-secondary)" textAnchor="middle" alignmentBaseline="middle">
            {startingFret}fr
          </text>
        )}

        {/* Draw Frets (horizontal lines) */}
        {Array.from({ length: numFretsToDraw + 1 }).map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={sidePadding}
            y1={topPadding + (i * fretSpacing)}
            x2={width - sidePadding}
            y2={topPadding + (i * fretSpacing)}
            stroke="var(--card-border)"
            strokeWidth="2"
          />
        ))}

        {/* Draw Strings (vertical lines) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`string-${i}`}
            x1={sidePadding + (i * stringSpacing)}
            y1={topPadding}
            x2={sidePadding + (i * stringSpacing)}
            y2={height - bottomPadding}
            stroke="var(--text-secondary)"
            strokeWidth={1 + (5 - i) * 0.3} // Cordas mais graves ligeiramente mais grossas
          />
        ))}

        {/* Draw Dots and X/O */}
        {posArray.map((pos, stringIndex) => {
          const x = sidePadding + (stringIndex * stringSpacing);
          
          if (pos === 'X') {
            return (
              <text key={`x-${stringIndex}`} x={x} y={topPadding - 15} fontSize="18" fill="var(--accent-primary)" textAnchor="middle" fontWeight="bold">
                X
              </text>
            );
          }
          
          if (pos === '0' || pos === 'O') {
            return (
              <circle key={`o-${stringIndex}`} cx={x} cy={topPadding - 15} r="6" fill="transparent" stroke="var(--accent-secondary)" strokeWidth="2" />
            );
          }

          const fretNum = parseInt(pos);
          if (!isNaN(fretNum) && fretNum > 0) {
            // Desenha a bolinha
            const fretRelative = fretNum - startingFret;
            const y = topPadding + (fretRelative * fretSpacing) + (fretSpacing / 2);
            return (
              <circle key={`dot-${stringIndex}`} cx={x} cy={y} r="8" fill="var(--text-primary)" />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default GuitarChord;
