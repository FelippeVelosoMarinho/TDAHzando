import React, { useState } from 'react';
import TDAHzandoHub from './TDAHzandoHub';
import ChordViewer from './ChordViewer';
import AddSongForm from './AddSongForm';
import Library from './Library';

function App() {
  const [currentView, setCurrentView] = useState('hub');
  const [songData, setSongData] = useState(null);
  const [viewMode, setViewMode] = useState('sync');

  const handleSelectSong = (parsedSong) => {
    setSongData(parsedSong);
    setCurrentView('viewer');
  };

  return (
    <>
      <nav style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', background: 'var(--card-bg)', borderBottom: '2px solid var(--card-border)', position: 'sticky', top: 0, zIndex: 100, alignItems: 'center' }}>
        <button onClick={() => setCurrentView('hub')} style={navBtnStyle(currentView === 'hub')}>Hub</button>
        <button onClick={() => setCurrentView('library')} style={navBtnStyle(currentView === 'library')}>Minhas Músicas</button>
        <button onClick={() => setCurrentView('add')} style={navBtnStyle(currentView === 'add')}>Adicionar Música</button>
        
        {songData && (
          <>
            <div style={{ width: '2px', height: '30px', background: 'var(--card-border)', margin: '0 1rem' }} />
            <button onClick={() => setCurrentView('viewer')} style={navBtnStyle(currentView === 'viewer')}>Visualizando: {songData.title}</button>
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '2px solid var(--card-border)', marginLeft: 'auto' }}>
              <option value="sync">Modo Timeline (Avançar)</option>
              <option value="survival">Modo Kit Sobrevivência</option>
            </select>
          </>
        )}
      </nav>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {currentView === 'hub' && <TDAHzandoHub />}
        
        {currentView === 'library' && (
          <div>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Minha Biblioteca de Cifras</h2>
            <Library onSelectSong={handleSelectSong} />
          </div>
        )}

        {currentView === 'add' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <AddSongForm onSongAdded={() => setCurrentView('library')} />
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
