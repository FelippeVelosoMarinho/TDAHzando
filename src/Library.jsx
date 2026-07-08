import React, { useState, useEffect } from 'react';
import { parseChordsFile } from './chordsParser';

const Library = ({ onSelectSong }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/songs');
      if (res.ok) {
        const data = await res.json();
        setSongs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja apagar esta música?')) return;
    
    try {
      await fetch(`/api/songs/${id}`, { method: 'DELETE' });
      fetchSongs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (song) => {
    // Fazer o parse da cifraText salva no banco
    const parsed = parseChordsFile(song.cifraText, { title: song.title });
    
    // Anexar propriedades de áudio e link para uso no visualizador
    parsed.audioUrl = song.audioUrl;
    parsed.youtubeLink = song.youtubeLink;
    parsed.artist = song.artist;
    
    onSelectSong(parsed);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando biblioteca...</div>;

  if (songs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
        Nenhuma música salva ainda. Adicione a sua primeira no botão acima!
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {songs.map(song => (
        <div 
          key={song.id} 
          onClick={() => handleCardClick(song)}
          style={{ 
            background: 'var(--card-bg)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '2px solid var(--card-border)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <button 
            onClick={(e) => handleDelete(song.id, e)}
            style={{ 
              position: 'absolute', top: '10px', right: '10px', 
              background: 'transparent', border: 'none', color: 'red', 
              cursor: 'pointer', fontSize: '1.2rem' 
            }}
            title="Deletar"
          >
            🗑
          </button>
          
          <h3 style={{ margin: 0, color: 'var(--text-primary)', paddingRight: '20px' }}>{song.title}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{song.artist}</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {song.audioUrl && <span style={badgeStyle}>🎵 Com Áudio</span>}
            {song.youtubeLink && <span style={{ ...badgeStyle, background: '#fee2e2', color: '#b91c1c' }}>▶ YouTube</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const badgeStyle = {
  background: 'var(--accent-secondary)',
  color: 'var(--text-primary)',
  padding: '0.3rem 0.6rem',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

export default Library;
