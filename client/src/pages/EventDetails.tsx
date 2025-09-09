import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Edit, ArrowLeft, UserPlus, Download } from 'lucide-react';
import { eventsApi, attendeesApi } from '../services/api';
import { Event, EventStats } from '../types';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEventDetails(id);
    }
  }, [id]);

  const loadEventDetails = async (eventId: string) => {
    try {
      setLoading(true);
      const [eventData, statsData] = await Promise.all([
        eventsApi.getById(eventId),
        eventsApi.getStats(eventId)
      ]);
      setEvent(eventData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error loading event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAttendees = async () => {
    if (!id) return;
    
    try {
      const blob = await attendeesApi.export(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendees-${event?.title || 'event'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export attendees');
      console.error('Error exporting attendees:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
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
        <div>Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="card">
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          {error || 'Event not found'}
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus(event.event_date);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{event.title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={`badge ${eventStatus.class}`}>
              {eventStatus.label}
            </span>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Calendar size={20} style={{ marginRight: '0.75rem', color: '#6b7280' }} />
              <div>
                <div style={{ fontWeight: '500' }}>Event Date</div>
                <div style={{ color: '#6b7280' }}>{formatDate(event.event_date)}</div>
              </div>
            </div>

            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <MapPin size={20} style={{ marginRight: '0.75rem', color: '#6b7280' }} />
                <div>
                  <div style={{ fontWeight: '500' }}>Location</div>
                  <div style={{ color: '#6b7280' }}>{event.location}</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Users size={20} style={{ marginRight: '0.75rem', color: '#6b7280' }} />
              <div>
                <div style={{ fontWeight: '500' }}>Attendees</div>
                <div style={{ color: '#6b7280' }}>
                  {stats?.total_attendees || 0} registered
                  {event.max_attendees && ` / ${event.max_attendees} max`}
                </div>
              </div>
            </div>

            {stats && stats.recent_registrations > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Clock size={20} style={{ marginRight: '0.75rem', color: '#6b7280' }} />
                <div>
                  <div style={{ fontWeight: '500' }}>Recent Registrations</div>
                  <div style={{ color: '#6b7280' }}>{stats.recent_registrations} in the last 7 days</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{event.description}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={`/events/${event.id}/register`} className="btn btn-primary">
            <UserPlus size={16} />
            Register Attendee
          </Link>
          <Link to={`/events/${event.id}/attendees`} className="btn btn-outline">
            <Users size={16} />
            View Attendees
          </Link>
          <Link to={`/events/${event.id}/edit`} className="btn btn-outline">
            <Edit size={16} />
            Edit Event
          </Link>
          <button
            onClick={handleExportAttendees}
            className="btn btn-outline"
            disabled={!stats?.total_attendees}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {stats && (
        <div className="grid grid-3">
          <div className="card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.total_attendees}
              </div>
              <div style={{ color: '#6b7280' }}>Total Attendees</div>
            </div>
          </div>
          
          <div className="card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.recent_registrations}
              </div>
              <div style={{ color: '#6b7280' }}>Recent Registrations</div>
            </div>
          </div>

          <div className="card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {event.max_attendees ? 
                  Math.round(((stats.total_attendees / event.max_attendees) * 100)) : 
                  '∞'
                }%
              </div>
              <div style={{ color: '#6b7280' }}>Capacity Used</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
