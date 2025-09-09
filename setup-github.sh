#!/bin/bash

# GitHub Setup Script for Event Tracker
echo "🚀 Setting up GitHub repository for Event Tracker..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Event Tracker with CI/CD setup

- Complete event management system
- Attendee registration and tracking
- Separate sheets for each event date
- Data export functionality
- GitHub Actions CI/CD pipeline
- Automated deployment to Hostinger
- Security auditing and testing"

# Get repository URL from user
echo ""
echo "🔗 Please provide your GitHub repository URL:"
echo "Example: https://github.com/yourusername/event-tracker.git"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No repository URL provided. Exiting..."
    exit 1
fi

# Add remote origin
echo "🌐 Adding remote origin..."
git remote add origin $REPO_URL

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ GitHub repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository: $REPO_URL"
echo "2. Go to Settings → Secrets and variables → Actions"
echo "3. Add these secrets:"
echo "   - HOSTINGER_FTP_HOST: Your Hostinger FTP host"
echo "   - HOSTINGER_FTP_USERNAME: Your FTP username"
echo "   - HOSTINGER_FTP_PASSWORD: Your FTP password"
echo "4. Push any changes to trigger the first deployment"
echo ""
echo "🎉 Your Event Tracker is now ready for automated deployment!"
