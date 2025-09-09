import axios from 'axios';
import { Event, Attendee, EventStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Events API
export const eventsApi = {
  getAll: (): Promise<Event[]> => api.get('/events').then(res => res.data),
  getById: (id: string): Promise<Event> => api.get(`/events/${id}`).then(res => res.data),
  create: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: string; message: string }> =>
    api.post('/events', event).then(res => res.data),
  update: (id: string, event: Partial<Event>): Promise<{ message: string }> =>
    api.put(`/events/${id}`, event).then(res => res.data),
  delete: (id: string): Promise<{ message: string }> =>
    api.delete(`/events/${id}`).then(res => res.data),
  getStats: (id: string): Promise<EventStats> =>
    api.get(`/events/${id}/stats`).then(res => res.data),
};

// Attendees API
export const attendeesApi = {
  getByEvent: (eventId: string): Promise<Attendee[]> =>
    api.get(`/attendees/event/${eventId}`).then(res => res.data),
  getById: (id: string): Promise<Attendee> =>
    api.get(`/attendees/${id}`).then(res => res.data),
  create: (attendee: Omit<Attendee, 'id' | 'registered_at'>): Promise<{ id: string; message: string }> =>
    api.post('/attendees', attendee).then(res => res.data),
  update: (id: string, attendee: Partial<Attendee>): Promise<{ message: string }> =>
    api.put(`/attendees/${id}`, attendee).then(res => res.data),
  delete: (id: string): Promise<{ message: string }> =>
    api.delete(`/attendees/${id}`).then(res => res.data),
  export: (eventId: string): Promise<Blob> =>
    api.get(`/attendees/event/${eventId}/export`, { responseType: 'blob' }).then(res => res.data),
};

export default api;
