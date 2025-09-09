const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const router = express.Router();

// Get all events
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      e.*,
      COUNT(a.id) as attendee_count
    FROM events e
    LEFT JOIN attendees a ON e.id = a.event_id
    GROUP BY e.id
    ORDER BY e.event_date DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single event
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM events WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(row);
  });
});

// Create new event
router.post('/', (req, res) => {
  const { title, description, event_date, location, max_attendees } = req.body;
  const id = uuidv4();
  
  const sql = `
    INSERT INTO events (id, title, description, event_date, location, max_attendees)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [id, title, description, event_date, location, max_attendees], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, message: 'Event created successfully' });
  });
});

// Update event
router.put('/:id', (req, res) => {
  const { title, description, event_date, location, max_attendees } = req.body;
  
  const sql = `
    UPDATE events 
    SET title = ?, description = ?, event_date = ?, location = ?, max_attendees = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [title, description, event_date, location, max_attendees, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event updated successfully' });
  });
});

// Delete event
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM events WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

// Get event statistics
router.get('/:id/stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_attendees,
      COUNT(CASE WHEN registered_at >= date('now', '-7 days') THEN 1 END) as recent_registrations
    FROM attendees 
    WHERE event_id = ?
  `;
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

module.exports = router;
