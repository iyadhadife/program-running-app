import { useState } from 'react';
import Calendar from './components/Calendar';
import Header from './components/Header';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'calendar' | 'profile'>('calendar');

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProfileUpdate = (newEmail: string) => {
    setUserEmail(newEmail);
    setCurrentView('calendar');
  };

  return (
    <div className={`app-main ${isDarkMode ? 'dark-mode' : ''}`}>
      {isAuthenticated && userEmail && (
        <Header 
          onLogout={handleLogout} 
          onToggleDarkMode={toggleDarkMode} 
          isDarkMode={isDarkMode}
          onNavigate={setCurrentView}
        />
      )}
      <div className="app-container">
        {isAuthenticated && userEmail ? (
          currentView === 'calendar' ? (
            <Calendar userEmail={userEmail} />
          ) : (
            <Profile 
              userEmail={userEmail} 
              onUpdateSuccess={handleProfileUpdate} 
              onCancel={() => setCurrentView('calendar')}
              isDarkMode={isDarkMode}
            />
          )
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;
