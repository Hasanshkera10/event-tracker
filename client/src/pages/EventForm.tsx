import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { eventsApi } from '../services/api';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_attendees: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      loadEvent(id);
    }
  }, [isEditing, id]);

  const loadEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const event = await eventsApi.getById(eventId);
      setFormData({
        title: event.title,
        description: event.description || '',
        event_date: event.event_date.split('T')[0], // Format for date input
        location: event.location || '',
        max_attendees: event.max_attendees?.toString() || '',
      });
    } catch (err) {
      setError('Failed to load event');
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
      };

      if (isEditing && id) {
        await eventsApi.update(id, eventData);
      } else {
        await eventsApi.create(eventData);
      }

      navigate('/');
    } catch (err) {
      setError(isEditing ? 'Failed to update event' : 'Failed to create event');
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="loading">
        <div>Loading event...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            backgroundColor: '#fef2f2', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Enter event description"
              rows={4}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="event_date" className="form-label">
                Event Date *
              </label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter event location"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="max_attendees" className="form-label">
              Maximum Attendees
            </label>
            <input
              type="number"
              id="max_attendees"
              name="max_attendees"
              value={formData.max_attendees}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
