import React, { useState, useEffect } from 'react';

interface ProfileProps {
  userEmail: string;
  onUpdateSuccess: (newEmail: string) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ userEmail, onUpdateSuccess, onCancel, isDarkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialData, setInitialData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setEmail(data.email);
        setInitialData({ name: data.name, email: data.email });
        setLoading(false);
      })
      .catch(err => console.error("Erreur chargement profil:", err));
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // On ne build l'objet que avec ce qui a changé
    const updates: any = {};
    if (name !== initialData.name) updates.name = name;
    if (email !== initialData.email) updates.email = email;
    if (password) updates.password = password; // Si rempli, on change le mdp

    if (Object.keys(updates).length === 0) {
      onCancel();
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/user/${userEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        alert('Profil mis à jour avec succès !');
        onUpdateSuccess(email); // On passe le nouvel email (ou l'ancien s'il n'a pas changé)
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (loading) return <div>Chargement...</div>;

  const inputStyle = {
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: isDarkMode ? '#333' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    width: '100%',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Modifier mon profil</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom complet</label>
          <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nouveau mot de passe</label>
          <input 
            style={inputStyle} 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{ flex: 1, backgroundColor: '#28a745', color: 'white' }}>Enregistrer</button>
          <button type="button" onClick={onCancel} style={{ flex: 1 }}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;