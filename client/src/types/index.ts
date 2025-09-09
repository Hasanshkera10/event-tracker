export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  max_attendees?: number;
  created_at: string;
  updated_at: string;
  attendee_count?: number;
}

export interface Attendee {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  dietary_requirements?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  registered_at: string;
}

export interface EventStats {
  total_attendees: number;
  recent_registrations: number;
}
