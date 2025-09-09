import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Calendar size={24} style={{ marginRight: '0.5rem' }} />
          Event Tracker
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                <Calendar size={16} />
                Events
              </Link>
            </li>
            <li>
              <Link to="/events/new">
                <Plus size={16} />
                New Event
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
