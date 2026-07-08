import React, { useState } from 'react';
import Library from './Library';
import AddSongForm from './AddSongForm';
import ChordViewer from './ChordViewer';
import { FaGuitar } from 'react-icons/fa';

export default function LumeChordsApp() {
  const [currentView, setCurrentView] = useState('library');
  const [songData, setSongData] = useState(null);
  const [viewMode, setViewMode] = useState('sync');

  const handleSelectSong = (parsedSong) => {
    setSongData(parsedSong);
    setCurrentView('viewer');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--card-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaGuitar /> Lume Chords
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Laboratório Musical</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setCurrentView('library')} style={btnStyle(currentView === 'library')}>Minhas Músicas</button>
          <button onClick={() => setCurrentView('add')} style={btnStyle(currentView === 'add')}>Adicionar Música</button>
          {songData && <button onClick={() => setCurrentView('viewer')} style={btnStyle(currentView === 'viewer')}>Visualizando: {songData.title}</button>}
        </div>
      </header>

      {currentView === 'library' && <Library onSelectSong={handleSelectSong} />}
      {currentView === 'add' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AddSongForm onSongAdded={() => setCurrentView('library')} />
        </div>
      )}
      {currentView === 'viewer' && songData && (
        <>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '2px solid var(--card-border)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              <option value="sync">Modo Timeline</option>
              <option value="survival">Modo Kit Sobrevivência</option>
            </select>
          </div>
          <ChordViewer songData={songData} language="PT" mode={viewMode} />
        </>
      )}
    </div>
  );
}

const btnStyle = (active) => ({
  background: active ? 'var(--text-primary)' : 'transparent',
  color: active ? 'white' : 'var(--text-primary)',
  border: '2px solid var(--text-primary)',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
});
