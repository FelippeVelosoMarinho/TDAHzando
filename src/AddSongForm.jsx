import React, { useState } from 'react';

const AddSongForm = ({ onSongAdded }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('artist', e.target.artist.value);
    formData.append('youtubeLink', e.target.youtubeLink.value);
    
    const audioFile = e.target.audioFile.files[0];
    if (audioFile) formData.append('audioFile', audioFile);

    const cifraFile = e.target.cifraFile.files[0];
    if (cifraFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        formData.append('cifraText', event.target.result);
        await postData(formData);
      };
      reader.readAsText(cifraFile);
    } else {
      await postData(formData);
    }
  };

  const postData = async (formData) => {
    try {
      const res = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        onSongAdded();
      } else {
        alert('Erro ao salvar no servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão. Verifique se o backend está rodando na porta 3001.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '2px solid var(--card-border)' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Adicionar Nova Música</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={labelStyle}>Título da Música</label>
          <input name="title" required type="text" style={inputStyle} placeholder="Ex: Float" />
        </div>

        <div>
          <label style={labelStyle}>Artista</label>
          <input name="artist" required type="text" style={inputStyle} placeholder="Ex: The Neighbourhood" />
        </div>

        <div>
          <label style={labelStyle}>Arquivo da Cifra (.txt)</label>
          <input name="cifraFile" required type="file" accept=".txt" style={inputStyle} />
          <small style={{ color: 'var(--text-secondary)' }}>O arquivo padrão com o dicionário de acordes no final.</small>
        </div>

        <div>
          <label style={labelStyle}>Áudio da Música (.mp3, .wav)</label>
          <input name="audioFile" type="file" accept="audio/*" style={inputStyle} />
          <small style={{ color: 'var(--text-secondary)' }}>Opcional. Para ouvir enquanto toca.</small>
        </div>

        <div>
          <label style={labelStyle}>Link do YouTube</label>
          <input name="youtubeLink" type="url" style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
          <small style={{ color: 'var(--text-secondary)' }}>Opcional. Referência em vídeo.</small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '1rem', 
            background: 'var(--text-primary)', 
            color: 'white', 
            padding: '1rem', 
            borderRadius: '8px', 
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'Salvando...' : 'Salvar no Laboratório'}
        </button>
      </form>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-primary)' };
const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '2px solid var(--card-border)' };

export default AddSongForm;
