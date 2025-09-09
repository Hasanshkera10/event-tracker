import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { eventsApi } from '../services/api';
import { Event } from '../types';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getAll();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventsApi.delete(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventStatus = (eventDate: string) => {
    const eventDateObj = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDateObj < today) {
      return { status: 'past', label: 'Past Event', class: 'badge-secondary' };
    } else if (eventDateObj.toDateString() === today.toDateString()) {
      return { status: 'today', label: 'Today', class: 'badge-warning' };
    } else {
      return { status: 'upcoming', label: 'Upcoming', class: 'badge-success' };
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          {error}
          <button onClick={loadEvents} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Event Dashboard</h1>
          <Link to="/events/new" className="btn btn-primary">
            <Plus size={16} />
            Create New Event
          </Link>
        </div>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Manage your events and track attendee registrations. Each event gets its own dedicated sheet for easy data management.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3>No events yet</h3>
            <p>Create your first event to start tracking attendees</p>
            <Link to="/events/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {events.map((event) => {
            const eventStatus = getEventStatus(event.event_date);
            return (
              <div key={event.id} className="card">
                <div className="card-header">
                  <h2 className="card-title">{event.title}</h2>
                  <span className={`badge ${eventStatus.class}`}>
                    {eventStatus.label}
                  </span>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Calendar size={16} style={{ marginRight: '0.5rem', color: '#6b7280' }} />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  
                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <MapPin size={16} style={{ marginRight: '0.5rem', color: '#6b7280' }} />
                      <span>{event.location}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Users size={16} style={{ marginRight: '0.5rem', color: '#6b7280' }} />
                    <span>
                      {event.attendee_count || 0} attendees
                      {event.max_attendees && ` / ${event.max_attendees} max`}
                    </span>
                  </div>
                </div>

                {event.description && (
                  <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {event.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/events/${event.id}`} className="btn btn-outline">
                    <Eye size={16} />
                    View
                  </Link>
                  <Link to={`/events/${event.id}/attendees`} className="btn btn-outline">
                    <Users size={16} />
                    Attendees
                  </Link>
                  <Link to={`/events/${event.id}/register`} className="btn btn-primary">
                    <Plus size={16} />
                    Register
                  </Link>
                  <Link to={`/events/${event.id}/edit`} className="btn btn-outline">
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="btn btn-outline"
                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
