import { useState } from 'react';
import Calendar from './components/Calendar';
import Header from './components/Header';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className={`app-main ${isDarkMode ? 'dark-mode' : ''}`}>
      {isAuthenticated && userEmail && (
        <Header 
          onLogout={handleLogout} 
          onToggleDarkMode={toggleDarkMode} 
          isDarkMode={isDarkMode}
        />
      )}
      <div className="app-container">
        {isAuthenticated && userEmail ? (
          <Calendar userEmail={userEmail} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;
