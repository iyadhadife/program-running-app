import React, { useState } from 'react';
import './Calendar.css';
import EventModal from './EventModal';

import type { CalendarEvent } from '../types';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

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

  const handleSaveEvent = (data: { title: string; description: string }) => {
    if (selectedEvent) {
      // Edit existing event
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...data } : event
        )
      );
    } else if (selectedDate) {
      // Create new event
      setEvents([
        ...events,
        { id: Date.now(), date: selectedDate, ...data },
      ]);
    }
    handleCloseModal();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      handleCloseModal();
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

