import { useState } from 'react';
import Calendar from './components/Calendar';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  return (
    <div>
      {isAuthenticated && userEmail ? (
        <>
          <h1>Calendrier d'événements sportifs</h1>
          <Calendar userEmail={userEmail} />
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
