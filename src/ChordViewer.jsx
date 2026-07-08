import React, { useState, useEffect } from 'react';
import './ChordViewer.css'; 
import GuitarChord from './GuitarChord';

const traduzirAcorde = (acordeAnglo, idioma = 'PT') => {
  if (!acordeAnglo) return '';
  if (idioma !== 'PT') return acordeAnglo;
  
  const mapa = { 'C': 'Dó', 'D': 'Ré', 'E': 'Mi', 'F': 'Fá', 'G': 'Sol', 'A': 'Lá', 'B': 'Si' };
  
  let notaRaiz = acordeAnglo.charAt(0);
  if (acordeAnglo.charAt(1) === '#' || acordeAnglo.charAt(1) === 'b') {
    notaRaiz = acordeAnglo.substring(0, 2);
  }
  
  const sufixo = acordeAnglo.replace(notaRaiz, '');
  return `${mapa[notaRaiz] || notaRaiz}${sufixo}`;
};

const ChordViewer = ({ songData, language = 'PT', mode = 'sync' }) => {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);

  const advance = () => {
    const currentSection = songData.structure[currentSectionIdx];
    if (currentLineIdx < currentSection.lines.length - 1) {
      setCurrentLineIdx(prev => prev + 1);
    } else if (currentSectionIdx < songData.structure.length - 1) {
      setCurrentSectionIdx(prev => prev + 1);
      setCurrentLineIdx(0);
    }
  };

  const goBack = () => {
    if (currentLineIdx > 0) {
      setCurrentLineIdx(prev => prev - 1);
    } else if (currentSectionIdx > 0) {
      setCurrentSectionIdx(prev => prev - 1);
      const prevSection = songData.structure[currentSectionIdx - 1];
      setCurrentLineIdx(prevSection.lines.length - 1);
    }
  };

  useEffect(() => {
    if (mode !== 'sync') return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIdx, currentSectionIdx, mode]);

  if (!songData || !songData.structure) return <div className="viewer-empty">Nenhuma música carregada.</div>;

  // Pegar os tokens (acorde + letra) da linha atual
  let activeTokens = [];
  let currentSectionName = '';
  if (mode === 'sync') {
    const currentSection = songData.structure[currentSectionIdx];
    currentSectionName = currentSection.section;
    activeTokens = currentSection.lines[currentLineIdx].tokens;
  }

  return (
    <div className="chord-viewer-container">
      <header className="song-header">
        <h2>{songData.title}</h2>
        <h3>{songData.artist}</h3>
        <div className="badges">
          <span className="badge difficulty">{songData.difficulty}</span>
          <span className="badge score">Score: {songData.difficultyScore}</span>
        </div>
      </header>

      {mode === 'survival' ? (
        <div className="survival-mode">
          <h3 style={{color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center'}}>Modo Kit Sobrevivência</h3>
          <p style={{marginBottom: '2rem', textAlign: 'center'}}>Posicione seus dedos conforme os diagramas e pratique as trocas de acorde:</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {songData.chords_used.map(chord => (
              <div key={chord} style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '2px solid var(--card-border)', textAlign: 'center' }}>
                <GuitarChord name={traduzirAcorde(chord, language)} positions={songData.chords_dict[chord]} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            [{currentSectionName}]
          </div>

          <div className="active-chords-timeline" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '3rem 1rem',
            background: 'var(--bg-color)',
            borderRadius: '16px',
            border: '2px solid var(--accent-secondary)',
            marginBottom: '2rem',
            minHeight: '350px'
          }}>
            {activeTokens.length === 0 ? (
              <div style={{display:'flex', alignItems:'center', color:'var(--text-secondary)'}}>
                (Pausa)
              </div>
            ) : (
              activeTokens.map((token, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '300px' }}>
                  {token.chord ? (
                    <GuitarChord name={traduzirAcorde(token.chord, language)} positions={songData.chords_dict[token.chord]} />
                  ) : (
                    // Espaçador invisível se for apenas texto contínuo
                    <div style={{ height: 250 }}></div>
                  )}
                  <div style={{ 
                    marginTop: '1.5rem', 
                    fontSize: '1.8rem', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)', 
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}>
                    {token.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="viewer-controls" style={{ marginTop: '2rem' }}>
            <button onClick={goBack} disabled={currentSectionIdx === 0 && currentLineIdx === 0}>
              Voltar
            </button>
            <button onClick={advance} className="btn-primary">
              Avançar (Espaço)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChordViewer;
