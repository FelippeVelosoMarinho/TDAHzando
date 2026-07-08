import React, { useState, useEffect } from 'react';

export default function TDAHzandoHub() {
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
    hyperfocus: "Hiperfoco 🎯",
    genius: "Genial (mas impossível) 💡",
    bored: "Já perdi o interesse 🥱"
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
              <h1>TDAHzando 🌪️</h1>
              <p>Diretório para colocar qualquer ideia repentina que você não conseguiu segurar e que provavelmente <strong>NUNCA</strong> será finalizada.</p>
          </div>
      </header>

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
                  <button type="submit" className="submit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
              </div>
              <div className="tags-wrapper">
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="hyperfocus" checked={status === 'hyperfocus'} onChange={() => setStatus('hyperfocus')} />
                      <span className="tag tag-hyperfocus">Hiperfoco 🎯</span>
                  </label>
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="genius" checked={status === 'genius'} onChange={() => setStatus('genius')} />
                      <span className="tag tag-genius">Genial (mas impossível) 💡</span>
                  </label>
                  <label className="tag-radio">
                      <input type="radio" name="idea-status" value="bored" checked={status === 'bored'} onChange={() => setStatus('bored')} />
                      <span className="tag tag-bored">Já perdi o interesse 🥱</span>
                  </label>
              </div>
          </form>
      </section>

      <section className="ideas-grid" id="ideas-grid">
        {ideas.map((idea, index) => (
          <div key={idea.id} className={`idea-card ${idea.status}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="idea-content">{idea.text}</div>
              <div className="idea-footer">
                  <span className="idea-tag">{tagNames[idea.status]}</span>
                  <button className="delete-btn" aria-label="Deletar ideia" onClick={() => deleteIdea(idea.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
              </div>
          </div>
        ))}
      </section>
    </div>
  );
}
