const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');

const router = express.Router();

// Get all attendees for an event
router.get('/event/:eventId', (req, res) => {
  const sql = `
    SELECT * FROM attendees 
    WHERE event_id = ? 
    ORDER BY registered_at DESC
  `;
  
  db.all(sql, [req.params.eventId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single attendee
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM attendees WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Attendee not found' });
      return;
    }
    res.json(row);
  });
});

// Register new attendee
router.post('/', (req, res) => {
  const {
    event_id,
    name,
    email,
    phone,
    company,
    position,
    dietary_requirements,
    emergency_contact,
    emergency_phone,
    notes
  } = req.body;
  
  const id = uuidv4();
  
  const sql = `
    INSERT INTO attendees (
      id, event_id, name, email, phone, company, position, 
      dietary_requirements, emergency_contact, emergency_phone, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [
    id, event_id, name, email, phone, company, position,
    dietary_requirements, emergency_contact, emergency_phone, notes
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, message: 'Attendee registered successfully' });
  });
});

// Update attendee
router.put('/:id', (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    position,
    dietary_requirements,
    emergency_contact,
    emergency_phone,
    notes
  } = req.body;
  
  const sql = `
    UPDATE attendees 
    SET name = ?, email = ?, phone = ?, company = ?, position = ?,
        dietary_requirements = ?, emergency_contact = ?, emergency_phone = ?, notes = ?
    WHERE id = ?
  `;
  
  db.run(sql, [
    name, email, phone, company, position,
    dietary_requirements, emergency_contact, emergency_phone, notes,
    req.params.id
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Attendee not found' });
      return;
    }
    res.json({ message: 'Attendee updated successfully' });
  });
});

// Delete attendee
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM attendees WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Attendee not found' });
      return;
    }
    res.json({ message: 'Attendee deleted successfully' });
  });
});

// Export attendees for an event (CSV format)
router.get('/event/:eventId/export', (req, res) => {
  const sql = `
    SELECT 
      a.name,
      a.email,
      a.phone,
      a.company,
      a.position,
      a.dietary_requirements,
      a.emergency_contact,
      a.emergency_phone,
      a.notes,
      a.registered_at,
      e.title as event_title,
      e.event_date
    FROM attendees a
    JOIN events e ON a.event_id = e.id
    WHERE a.event_id = ?
    ORDER BY a.registered_at DESC
  `;
  
  db.all(sql, [req.params.eventId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Convert to CSV
    if (rows.length === 0) {
      res.status(404).json({ error: 'No attendees found for this event' });
      return;
    }
    
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendees-${req.params.eventId}.csv"`);
    res.send(csvContent);
  });
});

module.exports = router;
