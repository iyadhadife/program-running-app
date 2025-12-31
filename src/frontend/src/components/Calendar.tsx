import React, { useState, useEffect } from 'react';
import './Calendar.css';
import EventModal from './EventModal';

// Assure-toi que ton type ressemble à ça dans types.ts
// export interface CalendarEvent { id: number; title: string; description?: string; date: Date; }
import type { CalendarEvent } from '../types';

interface CalendarProps {
  userEmail: string;
}

const Calendar: React.FC<CalendarProps> = ({ userEmail }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const API_URL = 'http://127.0.0.1:5000'; // L'adresse de ton backend Flask

  // --- 1. CHARGEMENT DES DONNÉES (GET) ---
  useEffect(() => {
    if (userEmail) {
      fetch(`${API_URL}/events?email=${userEmail}`)
        .then(res => res.json())
        .then(data => {
          console.log('Data received from backend:', data);
          // IMPORTANT : MySQL renvoie des dates en String ("2024-01-01").
          // React a besoin d'objets Date(). On doit convertir.
          const formattedEvents = data.map((evt: any) => ({
            id: evt.id,
            title: evt.title,
            description: evt.description,
            date: new Date(evt.date) // On convertit le string SQL en Date JS
          }));
          setEvents(formattedEvents);
        })
        .catch(err => console.error("Erreur chargement:", err));
    }
  }, [userEmail]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  // --- 2. SAUVEGARDE (POST ou PUT) ---
  const handleSaveEvent = async (data: { title: string; description: string }) => {
    // Astuce pour garder la bonne date locale au format YYYY-MM-DD pour MySQL
    const dateToUse = selectedEvent ? selectedEvent.date : selectedDate;
    if (!dateToUse) return;

    // On compense le décalage horaire pour éviter que le 12 devienne le 11
    const offset = dateToUse.getTimezoneOffset() * 60000;
    const localDate = new Date(dateToUse.getTime() - offset);
    const sqlDate = localDate.toISOString().split('T')[0];

    const payload = { ...data, date: sqlDate, email: userEmail };

    try {
      if (selectedEvent) {
        // --- CAS : MODIFICATION (PUT) ---
        const response = await fetch(`${API_URL}/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // Mise à jour locale
          setEvents(events.map(ev => 
            ev.id === selectedEvent.id ? { ...ev, ...data } : ev
          ));
        }
      } else {
        // --- CAS : CRÉATION (POST) ---
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newEventData = await response.json(); // On récupère le nouvel ID
          setEvents([
            ...events, 
            { ...data, id: newEventData.id, date: dateToUse, description: data.description, title: data.title }
          ]);
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  };

  // --- 3. SUPPRESSION (DELETE) ---
  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await fetch(`${API_URL}/events/${selectedEvent.id}?email=${userEmail}`, {
          method: 'DELETE',
        });
        
        // Si la BDD a supprimé, on supprime de l'affichage
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        handleCloseModal();
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-prev-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      
      // Filtrage corrigé pour comparer correctement les dates
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === dayDate.toDateString()
      );

      days.push(
        <div key={day} className="calendar-day" onClick={() => handleDayClick(day)}>
          <span>{day}</span>
          <div className="events">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="event"
                onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                title={event.description || event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const totalDays = days.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;
    for (let i = 0; i < remainingDays; i++) {
        days.push(<div key={`empty-next-${i}`} className="calendar-day empty"></div>);
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>Précédent</button>
        <h2>{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={goToNextMonth}>Suivant</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day weekday">{day}</div>
        ))}
        {renderDays()}
      </div>
      {isModalOpen && selectedDate && (
        <EventModal
          date={selectedDate}
          event={selectedEvent}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default Calendar;