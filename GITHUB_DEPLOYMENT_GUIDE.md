# 🚀 GitHub CI/CD Deployment Guide for Event Tracker

This guide will help you set up automated deployment to Hostinger using GitHub Actions and CI/CD.

## 📋 Prerequisites

- GitHub account
- Hostinger Premium hosting with FTP access
- Node.js project (already set up)

## 🔧 Step 1: Initialize Git Repository

```bash
cd /Users/techweed.co/event-tracker

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Event Tracker application"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/event-tracker.git

# Push to GitHub
git push -u origin main
```

## 🔐 Step 2: Set Up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

### Required Secrets:
- `HOSTINGER_FTP_HOST`: Your Hostinger FTP host (e.g., `ftp.yourdomain.com`)
- `HOSTINGER_FTP_USERNAME`: Your FTP username
- `HOSTINGER_FTP_PASSWORD`: Your FTP password

### How to get Hostinger FTP credentials:
1. Log into Hostinger control panel
2. Go to "FTP Accounts"
3. Create a new FTP account or use existing one
4. Note down the host, username, and password

## 🏗️ Step 3: GitHub Actions Workflows

The following workflows are already configured:

### 3.1 Main Deployment Workflow (`.github/workflows/deploy.yml`)
- **Triggers**: Push to main/master branch
- **Actions**:
  - Builds React frontend
  - Runs tests
  - Creates deployment package
  - Deploys to Hostinger via FTP
  - Notifies deployment status

### 3.2 Testing Workflow (`.github/workflows/test.yml`)
- **Triggers**: Push and pull requests
- **Actions**:
  - Tests on multiple Node.js versions
  - Runs backend and frontend tests
  - Builds the application
  - Uploads coverage reports

### 3.3 Security Audit Workflow (`.github/workflows/security.yml`)
- **Triggers**: Weekly schedule and pushes
- **Actions**:
  - Runs security audits
  - Checks for vulnerabilities
  - Reports security issues

## 🔄 Step 4: Automated Deployment Process

### 4.1 Development Workflow
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
```

### 4.2 What Happens Automatically
1. **GitHub Actions triggers** on push to main
2. **Tests run** to ensure code quality
3. **Application builds** (React frontend)
4. **Deployment package created**
5. **Files uploaded** to Hostinger via FTP
6. **Deployment status** reported

### 4.3 Monitoring Deployments
- Go to your GitHub repository
- Click "Actions" tab
- View deployment logs and status

## 🛠️ Step 5: Advanced Configuration

### 5.1 Environment-Specific Deployments

Create separate workflows for different environments:

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [ develop ]
# ... staging-specific configuration

# .github/workflows/deploy-production.yml
name: Deploy to Production
on:
  push:
    branches: [ main ]
# ... production-specific configuration
```

### 5.2 Manual Deployment

Add manual deployment trigger:

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch: # Allows manual triggering
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'production'
        type: choice
        options:
        - production
        - staging
```

### 5.3 Database Migrations

Add database migration step:

```yaml
- name: Run database migrations
  run: |
    # Add your migration commands here
    echo "Running database migrations..."
```

## 📊 Step 6: Monitoring and Notifications

### 6.1 Slack Notifications

Add Slack notifications for deployments:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 6.2 Email Notifications

Configure email notifications in GitHub repository settings.

### 6.3 Deployment Status Badge

Add to your README.md:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/event-tracker/workflows/Deploy%20to%20Hostinger/badge.svg)
```

## 🔒 Step 7: Security Best Practices

### 7.1 Secrets Management
- Never commit secrets to code
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly

### 7.2 Branch Protection
1. Go to repository Settings → Branches
2. Add rule for main branch:
   - Require pull request reviews
   - Require status checks
   - Require up-to-date branches

### 7.3 Code Quality
- Enable automated testing
- Use code quality tools
- Require passing tests before merge

## 🚀 Step 8: Deployment Commands

### 8.1 First Deployment
```bash
# Push to trigger first deployment
git push origin main
```

### 8.2 Subsequent Deployments
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Deployment happens automatically
```

### 8.3 Rollback Deployment
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## 📱 Step 9: Accessing Your Deployed Application

Once deployed, your Event Tracker will be available at:
- **Production URL**: `https://yourdomain.com`
- **Registration Links**: `https://yourdomain.com/events/[event-id]/register`

## 🔧 Troubleshooting

### Common Issues:

#### Issue 1: FTP Connection Failed
- Check FTP credentials in GitHub Secrets
- Verify Hostinger FTP account is active
- Check firewall settings

#### Issue 2: Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs in GitHub Actions

#### Issue 3: Deployment Not Triggering
- Ensure workflow files are in `.github/workflows/`
- Check branch names match workflow triggers
- Verify GitHub Actions are enabled

### Debugging Steps:
1. Check GitHub Actions logs
2. Verify secrets are set correctly
3. Test FTP connection manually
4. Review Hostinger error logs

## 📈 Step 10: Advanced Features

### 10.1 Blue-Green Deployment
Implement zero-downtime deployments:

```yaml
- name: Blue-Green Deployment
  run: |
    # Deploy to staging directory first
    # Test the deployment
    # Switch traffic to new version
    # Keep old version as backup
```

### 10.2 Database Backups
Add automated database backups:

```yaml
- name: Backup Database
  run: |
    # Create database backup
    # Upload to cloud storage
    # Notify on backup completion
```

### 10.3 Performance Monitoring
Add performance monitoring:

```yaml
- name: Performance Test
  run: |
    # Run performance tests
    # Check response times
    # Monitor resource usage
```

## 🎉 Success!

Your Event Tracker now has:
- ✅ Automated testing on every commit
- ✅ Automated deployment to Hostinger
- ✅ Security auditing
- ✅ Dependency updates
- ✅ Professional CI/CD pipeline

## 📞 Support

- GitHub Actions documentation
- Hostinger support
- Repository issues and discussions

Your Event Tracker is now production-ready with professional CI/CD! 🚀
