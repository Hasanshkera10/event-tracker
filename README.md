# Event Tracker

A comprehensive event management system for tracking attendees and sharing data with your team. Each event gets its own dedicated sheet for easy data management.

## Features

- **Event Management**: Create, edit, and manage events with specific dates
- **Attendee Registration**: Collect comprehensive attendee data including:
  - Personal information (name, email, phone)
  - Professional details (company, position)
  - Dietary requirements and emergency contacts
  - Additional notes
- **Separate Event Sheets**: Each event date has its own dedicated view and data management
- **Data Export**: Export attendee lists to CSV for each event
- **Search & Filter**: Find attendees quickly with search functionality
- **Real-time Updates**: Live attendee count and registration statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Styling**: Custom CSS with modern design
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /Users/techweed.co/event-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

5. **Open your browser**:
   Navigate to `http://localhost:3000` to access the application.

## Usage

### Creating Events

1. Click "Create New Event" from the dashboard
2. Fill in event details:
   - Event title (required)
   - Description
   - Event date (required)
   - Location
   - Maximum attendees (optional)
3. Save the event

### Managing Attendees

1. **Register Attendees**:
   - Go to any event and click "Register Attendee"
   - Fill in the comprehensive registration form
   - Attendees are automatically added to that event's sheet

2. **View Attendees**:
   - Click "View Attendees" on any event
   - See all registered attendees in a table format
   - Search and filter attendees
   - Edit attendee information inline
   - Delete attendees if needed

3. **Export Data**:
   - From the event details or attendee list, click "Export CSV"
   - Download a CSV file with all attendee data for that specific event

### Event Management

- **Dashboard**: View all events with attendee counts and status
- **Event Details**: See comprehensive event information and quick stats
- **Edit Events**: Modify event details anytime
- **Delete Events**: Remove events (this will also delete all associated attendees)

## Project Structure

```
event-tracker/
├── server/                 # Backend API
│   ├── routes/            # API routes
│   ├── database.js        # Database setup
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
├── database/              # SQLite database files
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/stats` - Get event statistics

### Attendees
- `GET /api/attendees/event/:eventId` - Get attendees for event
- `GET /api/attendees/:id` - Get single attendee
- `POST /api/attendees` - Register new attendee
- `PUT /api/attendees/:id` - Update attendee
- `DELETE /api/attendees/:id` - Delete attendee
- `GET /api/attendees/event/:eventId/export` - Export attendees CSV

## Database Schema

### Events Table
- `id` (TEXT PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `event_date` (TEXT NOT NULL)
- `location` (TEXT)
- `max_attendees` (INTEGER)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Attendees Table
- `id` (TEXT PRIMARY KEY)
- `event_id` (TEXT NOT NULL, FOREIGN KEY)
- `name` (TEXT NOT NULL)
- `email` (TEXT)
- `phone` (TEXT)
- `company` (TEXT)
- `position` (TEXT)
- `dietary_requirements` (TEXT)
- `emergency_contact` (TEXT)
- `emergency_phone` (TEXT)
- `notes` (TEXT)
- `registered_at` (DATETIME)

## Production Deployment

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Set environment variables**:
   ```bash
   NODE_ENV=production
   PORT=5000
   ```

3. **Start the production server**:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support or questions, please open an issue in the repository.
