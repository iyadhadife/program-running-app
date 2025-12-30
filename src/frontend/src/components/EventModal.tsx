import React, { useState, useEffect } from 'react';
import './EventModal.css';
import type { CalendarEvent } from '../types';

interface EventModalProps {
  date: Date;
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  onDelete: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ date, event, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [event]);

  const handleSave = () => {
    if (title) {
      onSave({ title, description });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      onDelete();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event ? 'Modifier' : 'Ajouter'} un événement pour le {date.toLocaleDateString('fr-FR')}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'événement"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          {event && <button onClick={handleDelete} className="delete-btn">Supprimer</button>}
          <button onClick={handleSave}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;