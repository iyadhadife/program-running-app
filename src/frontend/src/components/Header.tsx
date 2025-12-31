import React from 'react';

interface HeaderProps {
  onLogout: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onNavigate: (view: 'calendar' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onToggleDarkMode, isDarkMode, onNavigate }) => {
  return (
    <header style={{ 
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', 
      borderBottom: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`,
      marginBottom: '2rem'
    }}>
      <h1 style={{ 
        margin: 0, 
        fontSize: '1.5rem', 
        color: isDarkMode ? '#fff' : '#333' 
      }}>
        Calendrier des événements sportifs
      </h1>
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button onClick={() => onNavigate('calendar')}>Accueil</button>
        <button>Activités</button>
        <button onClick={() => onNavigate('profile')}>Changer Profil</button>
        <button onClick={onToggleDarkMode}>
          {isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
        </button>
        <button onClick={onLogout} style={{ backgroundColor: '#dc3545', color: 'white' }}>
          Profil (Déconnexion)
        </button>
      </nav>
    </header>
  );
};

export default Header;