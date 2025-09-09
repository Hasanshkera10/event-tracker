import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Download, ArrowLeft, Edit, Trash2, UserPlus, Search, Mail, Phone, Building } from 'lucide-react';
import { attendeesApi, eventsApi } from '../services/api';
import { Attendee, Event } from '../types';

const AttendeeList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Attendee>>({});

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (eventId: string) => {
    try {
      setLoading(true);
      const [attendeesData, eventData] = await Promise.all([
        attendeesApi.getByEvent(eventId),
        eventsApi.getById(eventId)
      ]);
      setAttendees(attendeesData);
      setEvent(eventData);
    } catch (err) {
      setError('Failed to load attendees');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendee = async (attendeeId: string) => {
    if (!window.confirm('Are you sure you want to delete this attendee?')) {
      return;
    }

    try {
      await attendeesApi.delete(attendeeId);
      setAttendees(attendees.filter(attendee => attendee.id !== attendeeId));
    } catch (err) {
      setError('Failed to delete attendee');
      console.error('Error deleting attendee:', err);
    }
  };

  const handleEditAttendee = (attendee: Attendee) => {
    setEditingId(attendee.id);
    setEditForm({
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      company: attendee.company,
      position: attendee.position,
      dietary_requirements: attendee.dietary_requirements,
      emergency_contact: attendee.emergency_contact,
      emergency_phone: attendee.emergency_phone,
      notes: attendee.notes,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await attendeesApi.update(editingId, editForm);
      setAttendees(attendees.map(attendee => 
        attendee.id === editingId 
          ? { ...attendee, ...editForm }
          : attendee
      ));
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError('Failed to update attendee');
      console.error('Error updating attendee:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
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

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading attendees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          {error}
          <button onClick={() => id && loadData(id)} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
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
          <h1 className="card-title">
            <Users size={24} style={{ marginRight: '0.5rem' }} />
            Attendees for {event?.title}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleExportAttendees}
              className="btn btn-outline"
              disabled={attendees.length === 0}
            >
              <Download size={16} />
              Export CSV
            </button>
            <Link to={`/events/${id}/register`} className="btn btn-primary">
              <UserPlus size={16} />
              Add Attendee
            </Link>
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="btn btn-outline"
            >
              <ArrowLeft size={16} />
              Back to Event
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div style={{ color: '#6b7280' }}>
              {filteredAttendees.length} of {attendees.length} attendees
            </div>
          </div>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="empty-state">
            <Users size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
            <h3>No attendees found</h3>
            <p>
              {searchTerm ? 'No attendees match your search criteria.' : 'No one has registered for this event yet.'}
            </p>
            {!searchTerm && (
              <Link to={`/events/${id}/register`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <UserPlus size={16} />
                Register First Attendee
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Dietary Requirements</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id}>
                    {editingId === attendee.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="form-input"
                            style={{ width: '100%', padding: '0.5rem' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="form-input"
                              style={{ padding: '0.5rem' }}
                              placeholder="Email"
                            />
                            <input
                              type="tel"
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              className="form-input"
                              style={{ padding: '0.5rem' }}
                              placeholder="Phone"
                            />
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.company || ''}
                            onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                            className="form-input"
                            style={{ width: '100%', padding: '0.5rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.position || ''}
                            onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                            className="form-input"
                            style={{ width: '100%', padding: '0.5rem' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.dietary_requirements || ''}
                            onChange={(e) => setEditForm({...editForm, dietary_requirements: e.target.value})}
                            className="form-input"
                            style={{ width: '100%', padding: '0.5rem' }}
                          />
                        </td>
                        <td>{formatDate(attendee.registered_at)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              onClick={handleSaveEdit}
                              className="btn btn-success"
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div style={{ fontWeight: '500' }}>{attendee.name}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.875rem' }}>
                            {attendee.email && (
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <Mail size={12} style={{ marginRight: '0.25rem', color: '#6b7280' }} />
                                <span>{attendee.email}</span>
                              </div>
                            )}
                            {attendee.phone && (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Phone size={12} style={{ marginRight: '0.25rem', color: '#6b7280' }} />
                                <span>{attendee.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {attendee.company && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Building size={12} style={{ marginRight: '0.25rem', color: '#6b7280' }} />
                              <span>{attendee.company}</span>
                            </div>
                          )}
                        </td>
                        <td>{attendee.position}</td>
                        <td>
                          {attendee.dietary_requirements && (
                            <span className="badge badge-info">
                              {attendee.dietary_requirements}
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatDate(attendee.registered_at)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              onClick={() => handleEditAttendee(attendee)}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteAttendee(attendee.id)}
                              className="btn btn-outline"
                              style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeList;
