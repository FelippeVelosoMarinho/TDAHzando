import React, { useState } from 'react';
import TDAHzandoHub from './TDAHzandoHub';
import LumeChordsApp from './LumeChordsApp';
import { FiLayers, FiMap } from 'react-icons/fi';
import { FaGuitar, FaDraftingCompass } from 'react-icons/fa';
import { GiScissors } from 'react-icons/gi';

function App() {
  const [currentApp, setCurrentApp] = useState('hub');

  const apps = {
    'hub': { name: 'Lume Chaos', icon: <FiLayers />, type: 'internal' },
    'chords': { name: 'Lume Chords', icon: <FaGuitar />, type: 'internal' },
    'maps': { name: 'Lume Maps', icon: <FiMap />, type: 'iframe', url: '/maps/' },
    'hair': { name: 'Lume Hair', icon: <GiScissors />, type: 'iframe', url: '/hair/' },
    'cad': { name: 'Lume Cad', icon: <FaDraftingCompass />, type: 'iframe', url: '/cad/' }
  };

  const activeApp = apps[currentApp];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Topbar: O Navegador Central do Ecossistema */}
      <nav style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', background: 'var(--card-bg)', borderBottom: '2px solid var(--card-border)', zIndex: 100, alignItems: 'center', flexShrink: 0 }}>
        {Object.entries(apps).map(([key, app]) => (
          <button 
            key={key} 
            onClick={() => setCurrentApp(key)} 
            style={navBtnStyle(currentApp === key)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {app.icon} {app.name}
            </span>
          </button>
        ))}
      </nav>

      {/* Área de Renderização da Aplicação Ativa */}
      <div style={{ flex: 1, width: '100%', overflowY: 'auto' }}>
        {activeApp.type === 'internal' && currentApp === 'hub' && (
          <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <TDAHzandoHub onAppSelect={(id) => setCurrentApp(id)} />
          </div>
        )}
        
        {activeApp.type === 'internal' && currentApp === 'chords' && (
          <LumeChordsApp />
        )}
        
        {activeApp.type === 'iframe' && (
          <iframe 
            src={activeApp.url} 
            title={activeApp.name}
            style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
          />
        )}
      </div>
    </div>
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
