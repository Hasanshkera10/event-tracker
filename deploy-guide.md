# Deploying Event Tracker to Hostinger Premium Hosting

## Prerequisites
- Hostinger Premium hosting account
- FTP/SFTP access credentials
- Node.js support enabled on your hosting plan

## Step 1: Prepare Your Application for Production

### 1.1 Build the Frontend
```bash
cd /Users/techweed.co/event-tracker
npm run build
```

### 1.2 Update Environment Variables
Create a production `.env` file:
```bash
NODE_ENV=production
PORT=5000
DATABASE_PATH=./database/events.db
```

### 1.3 Update Package.json Scripts
Add production start script:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "start:prod": "NODE_ENV=production node server/index.js"
  }
}
```

## Step 2: Hostinger Deployment Options

### Option A: Using Hostinger's File Manager (Recommended)

1. **Access Hostinger Control Panel**
   - Log into your Hostinger account
   - Go to "File Manager" in the control panel

2. **Upload Files**
   - Navigate to your domain's `public_html` folder
   - Upload the entire project folder structure

3. **Set Up Node.js Application**
   - Go to "Advanced" → "Node.js" in Hostinger control panel
   - Set Node.js version (recommend 18.x or 20.x)
   - Set application root to your project folder
   - Set startup file to `server/index.js`

### Option B: Using FTP/SFTP

1. **Connect via FTP Client**
   - Use FileZilla, WinSCP, or similar
   - Connect using your Hostinger FTP credentials

2. **Upload Project Files**
   - Upload the entire project to your domain's root directory

## Step 3: Database Setup

### 3.1 Create Database Directory
```bash
mkdir -p database
chmod 755 database
```

### 3.2 Set Database Permissions
```bash
chmod 644 database/events.db
```

## Step 4: Server Configuration

### 4.1 Update Server for Production
The server is already configured to serve static files from the React build.

### 4.2 Set Up Process Manager (PM2)
Install PM2 for process management:
```bash
npm install -g pm2
```

Create PM2 ecosystem file:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'event-tracker',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

## Step 5: Domain Configuration

### 5.1 Set Up Domain
- Point your domain to the Hostinger server
- Configure DNS settings if needed

### 5.2 SSL Certificate
- Enable SSL certificate in Hostinger control panel
- This will provide HTTPS for your application

## Step 6: Final Steps

### 6.1 Install Dependencies
```bash
npm install --production
```

### 6.2 Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6.3 Test Application
- Visit your domain to test the application
- Check that events can be created and attendees can register

## Troubleshooting

### Common Issues:

1. **Port Issues**
   - Hostinger may use different ports
   - Check Hostinger documentation for correct port configuration

2. **Database Permissions**
   - Ensure database directory has write permissions
   - Check file ownership

3. **Node.js Version**
   - Ensure compatible Node.js version is selected
   - Check Hostinger's supported versions

4. **Static File Serving**
   - Verify React build files are in correct location
   - Check server static file configuration

### Support Resources:
- Hostinger Knowledge Base
- Hostinger Support Chat
- Node.js Documentation

## Alternative: VPS Deployment

If you have Hostinger VPS hosting:

1. **SSH Access**
   ```bash
   ssh username@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and Deploy**
   ```bash
   git clone your-repo-url
   cd event-tracker
   npm install
   npm run build
   pm2 start ecosystem.config.js
   ```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use Hostinger's environment variable settings

2. **Database Security**
   - Regular backups
   - Secure file permissions

3. **HTTPS**
   - Always use SSL certificates
   - Redirect HTTP to HTTPS

## Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Application Logs**
   - Check Hostinger error logs
   - Monitor application performance

## Backup Strategy

1. **Database Backups**
   - Regular SQLite database backups
   - Store backups in secure location

2. **Code Backups**
   - Version control with Git
   - Regular code backups

This deployment guide should help you successfully deploy your Event Tracker application to Hostinger premium hosting!
