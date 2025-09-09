#!/bin/bash

# Event Tracker Deployment Script for Hostinger
echo "🚀 Preparing Event Tracker for Hostinger deployment..."

# Build the React frontend
echo "📦 Building React frontend..."
cd client
npm run build
cd ..

# Create production environment file
echo "⚙️ Creating production environment..."
cp .env.example .env.production

# Install production dependencies
echo "📥 Installing production dependencies..."
npm install --production

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p ../event-tracker-deploy
cp -r server ../event-tracker-deploy/
cp -r client/build ../event-tracker-deploy/client/
cp package.json ../event-tracker-deploy/
cp ecosystem.config.js ../event-tracker-deploy/
cp .env.production ../event-tracker-deploy/.env
cp -r database ../event-tracker-deploy/ 2>/dev/null || mkdir -p ../event-tracker-deploy/database

# Set permissions
echo "🔐 Setting permissions..."
chmod 755 ../event-tracker-deploy/database
chmod 644 ../event-tracker-deploy/.env

echo "✅ Deployment package created in ../event-tracker-deploy/"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of ../event-tracker-deploy/ to your Hostinger hosting"
echo "2. Set up Node.js application in Hostinger control panel"
echo "3. Configure your domain and SSL certificate"
echo "4. Start the application with: npm start"
echo ""
echo "🌐 Your Event Tracker will be available at your domain!"
