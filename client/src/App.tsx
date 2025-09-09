import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import AttendeeForm from './pages/AttendeeForm';
import AttendeeList from './pages/AttendeeList';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events/new" element={<EventForm />} />
            <Route path="/events/:id/edit" element={<EventForm />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/register" element={<AttendeeForm />} />
            <Route path="/events/:id/attendees" element={<AttendeeList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;