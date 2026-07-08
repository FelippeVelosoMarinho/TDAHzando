import * as Tone from 'tone';

// Array com as notas MIDI das cordas soltas (da 6ª corda grave para a 1ª corda aguda)
// E2, A2, D3, G3, B3, E4
const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64];

// Inicializando o sintetizador polifônico.
// Você pode trocar isso pelo Tone.Sampler carregando seus próprios arquivos MP3!
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: "custom",
    partials: [1, 0.5, 0.25, 0.125] // Som um pouco mais rico, parecido com corda
  },
  envelope: {
    attack: 0.01,
    decay: 1.5,
    sustain: 0,
    release: 1.2
  }
}).toDestination();
// Reduz o volume geral para não estourar
synth.volume.value = -10;

/**
 * Toca um acorde com efeito de "Strum" (palhetada).
 * @param {string} positions Ex: "3 X 4 4 3 X" ou "X 0 2 0 1 0"
 */
export const playStrum = async (positions) => {
  if (!positions) return;

  // Garante que o contexto de áudio do navegador iniciou
  await Tone.start();

  const posArray = positions.split(' ').map(p => p.toUpperCase());
  
  const notesToPlay = [];

  posArray.forEach((pos, stringIndex) => {
    // Ignora a corda se tiver um X
    if (pos === 'X') return;

    // Calcula a nota real
    const openMidi = OPEN_STRINGS_MIDI[stringIndex];
    let fret = 0;
    
    if (pos !== 'O' && pos !== '0') {
      fret = parseInt(pos);
      if (isNaN(fret)) return;
    }

    const finalMidi = openMidi + fret;
    // Converte MIDI para Frequência (nota) usando Tone.js
    const noteName = Tone.Frequency(finalMidi, "midi").toNote();
    
    notesToPlay.push(noteName);
  });

  if (notesToPlay.length === 0) return;

  const now = Tone.now();
  
  // Efeito de palhetada: toca cada nota com um pequeno atraso (30ms a 50ms)
  const strumDelay = 0.04;
  
  notesToPlay.forEach((note, index) => {
    // Synth toca a nota (note) com duração (2n = mínima) no tempo (now + delay)
    synth.triggerAttackRelease(note, "2n", now + (index * strumDelay));
  });
};
