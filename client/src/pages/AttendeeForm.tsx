import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, Briefcase, Utensils, PhoneCall, FileText, Save, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { attendeesApi, eventsApi } from '../services/api';
import { Event } from '../types';

const AttendeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    dietary_requirements: '',
    emergency_contact: '',
    emergency_phone: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadEvent(id);
    }
  }, [id]);

  const loadEvent = async (eventId: string) => {
    try {
      const eventData = await eventsApi.getById(eventId);
      setEvent(eventData);
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error loading event:', err);
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
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await attendeesApi.create({
        event_id: id,
        ...formData,
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        dietary_requirements: '',
        emergency_contact: '',
        emergency_phone: '',
        notes: '',
      });

      // Redirect to event details after 2 seconds
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to register attendee');
      console.error('Error registering attendee:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="loading">
        <div>Loading event...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            color: '#10b981', 
            marginBottom: '1rem' 
          }}>
            ✓
          </div>
          <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            Registration Successful!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Thank you for registering for <strong>{event.title}</strong>.
            You will be redirected to the event page shortly.
          </p>
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="btn btn-primary"
          >
            View Event Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Register for {event.title}</h1>
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="btn btn-outline"
          >
            <ArrowLeft size={16} />
            Back to Event
          </button>
        </div>

        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <Calendar size={16} style={{ marginRight: '0.5rem', color: '#0369a1' }} />
            <strong>Event Date:</strong>
            <span style={{ marginLeft: '0.5rem', color: '#0369a1' }}>
              {new Date(event.event_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </span>
          </div>
          {event.location && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MapPin size={16} style={{ marginRight: '0.5rem', color: '#0369a1' }} />
              <strong>Location:</strong>
              <span style={{ marginLeft: '0.5rem', color: '#0369a1' }}>{event.location}</span>
            </div>
          )}
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
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} style={{ marginRight: '0.5rem' }} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone size={16} style={{ marginRight: '0.5rem' }} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">
                <Building size={16} style={{ marginRight: '0.5rem' }} />
                Company/Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              <Briefcase size={16} style={{ marginRight: '0.5rem' }} />
              Position/Title
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your position or title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dietary_requirements" className="form-label">
              <Utensils size={16} style={{ marginRight: '0.5rem' }} />
              Dietary Requirements
            </label>
            <input
              type="text"
              id="dietary_requirements"
              name="dietary_requirements"
              value={formData.dietary_requirements}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Any dietary restrictions or allergies?"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="emergency_contact" className="form-label">
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Emergency Contact Name
              </label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Emergency contact name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergency_phone" className="form-label">
                <PhoneCall size={16} style={{ marginRight: '0.5rem' }} />
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                id="emergency_phone"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Emergency contact phone"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              <FileText size={16} style={{ marginRight: '0.5rem' }} />
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Any additional information or special requests?"
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Registering...' : 'Register for Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
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

export default AttendeeForm;
