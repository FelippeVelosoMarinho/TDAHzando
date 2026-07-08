import React, { useState } from 'react';
import TDAHzandoHub from './TDAHzandoHub';
import ChordViewer from './ChordViewer';
import { parseChordsFile } from './chordsParser';

function App() {
  const [currentView, setCurrentView] = useState('hub');
  const [songData, setSongData] = useState(null);
  const [viewMode, setViewMode] = useState('sync');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsed = parseChordsFile(text, { title: file.name.replace('.txt', '') });
        setSongData(parsed);
        setCurrentView('viewer'); // Pula direto para o visualizador
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <nav style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', background: 'var(--card-bg)', borderBottom: '2px solid var(--card-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => setCurrentView('hub')} style={navBtnStyle(currentView === 'hub')}>TDAHzando Hub</button>
        <button onClick={() => setCurrentView('upload')} style={navBtnStyle(currentView === 'upload')}>Adicionar Música</button>
        {songData && (
          <button onClick={() => setCurrentView('viewer')} style={navBtnStyle(currentView === 'viewer')}>Visualizando: {songData.title}</button>
        )}
      </nav>

      <main style={{ padding: '2rem' }}>
        {currentView === 'hub' && <TDAHzandoHub />}
        
        {currentView === 'upload' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '2px solid var(--card-border)' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Carregar Cifra (Padrão CifraClub)</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Envie um arquivo .txt com a cifra formatada e o dicionário de acordes no final. O sistema vai extrair a música e gerar os diagramas automaticamente.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Escolha o Modo de Estudo:</label>
                  <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '2px solid var(--card-border)', fontSize: '1rem' }}>
                    <option value="sync">Modo: Respeitar meu tempo (Espaço para avançar timeline)</option>
                    <option value="survival">Modo: Kit Sobrevivência (Praticar posições antes)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. Envie o Arquivo:</label>
                  <input type="file" accept=".txt" onChange={handleFileUpload} style={{ width: '100%', padding: '1rem', border: '2px dashed var(--card-border)', borderRadius: '8px', background: 'var(--bg-color)' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'viewer' && songData && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <ChordViewer songData={songData} language="PT" mode={viewMode} />
          </div>
        )}
      </main>
    </>
  );
}

const navBtnStyle = (active) => ({
  background: active ? 'var(--text-primary)' : 'transparent',
  border: '2px solid',
  borderColor: active ? 'var(--text-primary)' : 'var(--card-border)',
  color: active ? 'white' : 'var(--text-primary)',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600'
});

export default App;
