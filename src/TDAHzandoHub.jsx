import React, { useState, useEffect } from 'react';
import { FiLayers, FiMap } from 'react-icons/fi';
import { FaGuitar, FaDraftingCompass } from 'react-icons/fa';
import { GiScissors } from 'react-icons/gi';
import { TbFocus2, TbBulb, TbZzz } from 'react-icons/tb';
import { MdOutlineSend, MdOutlineDelete } from 'react-icons/md';

export default function TDAHzandoHub({ onAppSelect }) {
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem('tdahzando-ideas');
    if (saved) return JSON.parse(saved);
    return [
        {
            id: Date.now(),
            text: "Fazer um app para cadastrar ideias que nunca vou fazer",
            status: "hyperfocus",
            date: new Date().toLocaleDateString()
        }
    ];
  });
  
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('hyperfocus');

  useEffect(() => {
    localStorage.setItem('tdahzando-ideas', JSON.stringify(ideas));
  }, [ideas]);

  const tagNames = {
    hyperfocus: <><TbFocus2 /> Hiperfoco</>,
    genius: <><TbBulb /> Genial (mas impossível)</>,
    bored: <><TbZzz /> Já perdi o interesse</>
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newIdea = {
      id: Date.now(),
      text: inputText,
      status,
      date: new Date().toLocaleDateString()
    };
    setIdeas([newIdea, ...ideas]);
    setInputText('');
  };

  const deleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  return (
    <div className="app-container" style={{ padding: 0 }}>
      <header>
          <div className="header-content">
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <FiLayers /> Lume Chaos
              </h1>
              <p>O repositório oficial das ideias não testadas e laboratório central do ecossistema <strong>Lume</strong>.</p>
              <p>Can you feel the light, inside, can u feel that fireeee oooooooooo</p>
              <p></p>
          </div>
      </header>

      {/* Vitrine de Aplicações do Ecossistema */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Ecossistema Lume</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          
          <div style={appCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}><FaGuitar /></div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Lume Chords</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Laboratório musical interativo.</p>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onAppSelect('chords')} 
                style={linkStyle}
              >
                Abrir App ↗
              </button>
            </div>
          </div>

          <div style={appCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}><FiMap /></div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Lume Maps</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ideia/App para mapas e geolocalização.</p>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onAppSelect('maps')} 
                style={linkStyle}
              >
                Abrir App ↗
              </button>
              <a href="https://github.com/FelippeVelosoMarinho/v-maps.git" target="_blank" rel="noreferrer" style={{...linkStyle, background: 'var(--card-border)', color: 'var(--text-primary)'}}>Repo</a>
            </div>
          </div>

          <div style={appCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}><GiScissors /></div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Lume Hair</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Futuro sistema focado em salões e estética.</p>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onAppSelect('hair')} 
                style={linkStyle}
              >
                Abrir App ↗
              </button>
              <a href="https://github.com/FelippeVelosoMarinho/v-hair.git" target="_blank" rel="noreferrer" style={{...linkStyle, background: 'var(--card-border)', color: 'var(--text-primary)'}}>Repo</a>
            </div>
          </div>

          <div style={appCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}><FaDraftingCompass /></div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Lume Cad</h3>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ferramenta NeuralCAD e arquitetura.</p>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onAppSelect('cad')} 
                style={linkStyle}
              >
                Abrir App ↗
              </button>
              <a href="https://github.com/FelippeVelosoMarinho/NeuralCAD-Architec.git" target="_blank" rel="noreferrer" style={{...linkStyle, background: 'var(--card-border)', color: 'var(--text-primary)'}}>Repo</a>
            </div>
          </div>

        </div>
      </section>
{/* 
      <section className="input-section">
          <form id="idea-form" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                  <input 
                    type="text" 
                    id="idea-input" 
                    placeholder="Tive uma ideia muito louca de..." 
                    autoComplete="off" 
                    required 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button type="submit" className="submit-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem', fontSize: '1.2rem' }}>
                      <MdOutlineSend />
                  </button>
              </div>
              <div className="tags-wrapper">
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="hyperfocus" checked={status === 'hyperfocus'} onChange={() => setStatus('hyperfocus')} />
                      <span className="tag tag-hyperfocus" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><TbFocus2 /> Hiperfoco</span>
                  </label>
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="genius" checked={status === 'genius'} onChange={() => setStatus('genius')} />
                      <span className="tag tag-genius" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><TbBulb /> Genial (mas impossível)</span>
                  </label>
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="bored" checked={status === 'bored'} onChange={() => setStatus('bored')} />
                      <span className="tag tag-bored" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><TbZzz /> Já perdi o interesse</span>
                  </label>
              </div>
          </form>
      </section> */}
{/* 
      <section className="ideas-grid" id="ideas-grid">
        {ideas.map((idea, index) => (
          <div key={idea.id} className={`idea-card ${idea.status}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="idea-content">{idea.text}</div>
              <div className="idea-footer">
                  <span className="idea-tag">{tagNames[idea.status]}</span>
                  <button className="delete-btn" aria-label="Deletar ideia" onClick={() => deleteIdea(idea.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      <MdOutlineDelete />
                  </button>
              </div>
          </div>
        ))}
      </section> */}
    </div>
  );
}

const appCardStyle = {
  background: 'var(--card-bg)',
  border: '2px solid var(--card-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'transform 0.2s ease',
};

const linkStyle = {
  marginTop: 'auto',
  display: 'inline-block',
  background: 'var(--text-primary)',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

const activeBadgeStyle = {
  marginTop: 'auto',
  display: 'inline-block',
  background: 'var(--accent-secondary)',
  color: 'var(--text-primary)',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};
