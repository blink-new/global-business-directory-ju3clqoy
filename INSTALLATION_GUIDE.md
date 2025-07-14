# Global Business Directory Platform - Installation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Specifications](#technical-specifications)
3. [Prerequisites](#prerequisites)
4. [Method 1: Download from Blink](#method-1-download-from-blink)
5. [Method 2: Clone from GitHub](#method-2-clone-from-github)
6. [Local Development Setup](#local-development-setup)
7. [Hostinger Hosting Setup](#hostinger-hosting-setup)
8. [Environment Configuration](#environment-configuration)
9. [Database Setup](#database-setup)
10. [Deployment Steps](#deployment-steps)
11. [Post-Deployment Configuration](#post-deployment-configuration)
12. [Troubleshooting](#troubleshooting)

## Project Overview

The Global Business Directory Platform is a comprehensive PWA (Progressive Web App) built with modern web technologies. It provides a scalable solution for managing business listings worldwide with advanced search capabilities, multi-role user management, and automated data ingestion.

### Key Features
- **Global Reach**: Support for businesses from all countries
- **Multi-Role System**: Guest, Business Owner, Moderator, Super Admin
- **Advanced Search**: Location-based, category filtering, map integration
- **PWA Capabilities**: Offline support, mobile app-like experience
- **Automated Data Ingestion**: Script for bulk business data import
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Technical Specifications

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API

### Backend & Services
- **Authentication**: Blink SDK Auth
- **Database**: Blink SDK Database (SQLite-based)
- **Storage**: Blink SDK Storage
- **Analytics**: Blink SDK Analytics
- **Real-time**: Blink SDK Realtime

### PWA Features
- Service Worker for offline functionality
- Web App Manifest for installability
- Responsive design for all devices
- Fast loading with code splitting

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Prerequisites

Before starting the installation, ensure you have:

1. **Node.js** (version 18.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`

3. **Git** (for cloning repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Hostinger Hosting Account**
   - Business or Premium plan recommended
   - Access to File Manager or FTP
   - Node.js support (if using Node.js hosting)

5. **Code Editor** (recommended)
   - Visual Studio Code
   - WebStorm
   - Sublime Text

## Method 1: Download from Blink

### Step 1: Access Your Blink Project
1. Go to [blink.new](https://blink.new)
2. Sign in to your account
3. Navigate to your "Global Business Directory Platform" project

### Step 2: Download Project Files
1. In your Blink project, look for the **"Download Code"** button in the top navigation
2. Click **"Download Code"**
3. A ZIP file will be generated and downloaded to your computer
4. Extract the ZIP file to your desired location

## Method 2: Clone from GitHub

### Step 1: Clone Repository
```bash
git clone https://github.com/blink-new/global-business-directory-ju3clqoy.git
cd global-business-directory-ju3clqoy
```

### Step 2: Switch to Main Branch
```bash
git checkout main
git pull origin main
```

## Local Development Setup

### Step 1: Install Dependencies
```bash
# Navigate to project directory
cd global-business-directory-ju3clqoy

# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

### Step 2: Environment Configuration
1. The project uses Blink SDK which handles environment variables automatically
2. No manual `.env` file creation is needed
3. Blink SDK will manage authentication and API keys

### Step 3: Start Development Server
```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 4: Verify Installation
1. Open your browser and go to `http://localhost:5173`
2. You should see the Global Business Directory homepage
3. Test basic functionality:
   - Search bar
   - Navigation menu
   - Responsive design (resize browser window)

## Hostinger Hosting Setup

### Option A: Static Site Hosting (Recommended)

#### Step 1: Build Production Files
```bash
# Create production build
npm run build

# This creates a 'dist' folder with optimized files
```

#### Step 2: Access Hostinger File Manager
1. Log in to your Hostinger control panel
2. Go to **"File Manager"**
3. Navigate to your domain's **public_html** folder

#### Step 3: Upload Files
1. Delete any existing files in public_html (if this is a new domain)
2. Upload all contents from the **`dist`** folder to **public_html**
3. Ensure the file structure looks like:
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── ...
   ├── favicon.svg
   └── _redirects
   ```

#### Step 4: Configure Redirects
1. Ensure the `_redirects` file is in the root of public_html
2. This file handles client-side routing for the React app

### Option B: Node.js Hosting (Advanced)

If your Hostinger plan supports Node.js:

#### Step 1: Enable Node.js
1. In Hostinger control panel, go to **"Advanced" → "Node.js"**
2. Create a new Node.js app
3. Select Node.js version 18 or higher

#### Step 2: Upload Source Code
1. Upload the entire project folder (not just dist)
2. Install dependencies on the server:
   ```bash
   npm install --production
   ```

#### Step 3: Configure Start Script
1. Set the startup file to a custom server script
2. Create `server.js` in the root:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   const port = process.env.PORT || 3000;

   app.use(express.static(path.join(__dirname, 'dist')));

   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });
   ```

## Environment Configuration

### Blink SDK Configuration
The project uses Blink SDK which automatically handles:
- User authentication
- Database connections
- File storage
- Analytics tracking

### Custom Configuration (if needed)
If you need to modify any settings:

1. **Project ID**: Located in `src/blink/client.ts`
2. **API Endpoints**: Managed by Blink SDK
3. **Database Schema**: Defined in the application code

## Database Setup

### Automatic Setup
The Blink SDK automatically handles database setup including:
- User tables
- Business listing tables
- Category and location tables
- Review and rating tables

### Manual Database Operations
If you need to run custom SQL:
1. Access your Blink project dashboard
2. Go to the "Database" section
3. Use the SQL query interface for custom operations

## Deployment Steps

### Step-by-Step Deployment to Hostinger

#### Step 1: Prepare Files
```bash
# 1. Navigate to your project
cd global-business-directory-ju3clqoy

# 2. Install dependencies (if not done)
npm install

# 3. Build for production
npm run build

# 4. Verify build
ls -la dist/
```

#### Step 2: Access Hostinger
1. **Login**: Go to hostinger.com and sign in
2. **Control Panel**: Access your hosting control panel
3. **File Manager**: Click on "File Manager"
4. **Domain Selection**: Choose your domain

#### Step 3: Upload Files
1. **Clear Directory**: Delete existing files in public_html
2. **Upload Method**: Choose one:
   - **Drag & Drop**: Drag files from your `dist` folder
   - **Upload Button**: Use the upload button in File Manager
   - **FTP Client**: Use FileZilla or similar FTP client

3. **File Structure**: Ensure your public_html contains:
   ```
   public_html/
   ├── index.html
   ├── assets/
   ├── favicon.svg
   ├── _redirects
   └── vite.svg
   ```

#### Step 4: Set Permissions
1. **File Permissions**: Set to 644 for files
2. **Folder Permissions**: Set to 755 for folders
3. **Index File**: Ensure index.html is readable

#### Step 5: Configure Domain
1. **DNS Settings**: Ensure domain points to Hostinger
2. **SSL Certificate**: Enable SSL in Hostinger control panel
3. **WWW Redirect**: Configure www/non-www preference

## Post-Deployment Configuration

### Step 1: Test Website
1. **Access Site**: Visit your domain
2. **Test Features**:
   - Homepage loads correctly
   - Search functionality works
   - Navigation is responsive
   - Forms submit properly

### Step 2: SEO Setup
1. **Google Search Console**: Add your domain
2. **Analytics**: Configure if needed
3. **Sitemap**: The app generates sitemap automatically

### Step 3: Performance Optimization
1. **Hostinger CDN**: Enable if available
2. **Caching**: Configure browser caching
3. **Compression**: Enable Gzip compression

### Step 4: Security Configuration
1. **SSL Certificate**: Verify HTTPS is working
2. **Security Headers**: Configure in .htaccess if needed
3. **Backup**: Set up regular backups

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Blank Page After Deployment
**Symptoms**: Website shows blank page or loading screen
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify all files uploaded correctly
3. Check file permissions (644 for files, 755 for folders)
4. Ensure _redirects file is present

#### Issue 2: 404 Errors on Page Refresh
**Symptoms**: Direct URLs return 404 errors
**Solutions**:
1. Verify _redirects file is in public_html root
2. Check if Hostinger supports client-side routing
3. Add .htaccess file with rewrite rules:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

#### Issue 3: Slow Loading Times
**Solutions**:
1. Enable Hostinger CDN
2. Optimize images before upload
3. Check internet connection
4. Verify server location

#### Issue 4: Authentication Issues
**Solutions**:
1. Check Blink SDK configuration
2. Verify project ID in client.ts
3. Ensure domain is whitelisted in Blink dashboard

#### Issue 5: Database Connection Errors
**Solutions**:
1. Verify Blink project is active
2. Check network connectivity
3. Review Blink SDK documentation

### Getting Help

#### Hostinger Support
- **Live Chat**: Available 24/7
- **Knowledge Base**: help.hostinger.com
- **Email Support**: Available for all plans

#### Blink Support
- **Documentation**: Available in Blink dashboard
- **Community**: Discord server
- **Email**: support@blink.new

#### Development Support
- **GitHub Issues**: For code-related problems
- **Stack Overflow**: For general React/TypeScript questions
- **MDN Web Docs**: For web standards reference

## Additional Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Blink SDK Documentation](https://blink.new/docs)

### Tools and Utilities
- [Hostinger File Manager](https://www.hostinger.com/tutorials/how-to-use-file-manager)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Performance Monitoring
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

---

## Conclusion

This installation guide provides comprehensive instructions for deploying your Global Business Directory Platform to Hostinger hosting. The platform is designed to be scalable, performant, and user-friendly.

For additional support or custom modifications, consider:
1. Reviewing the Blink SDK documentation
2. Joining the Blink community Discord
3. Consulting with web development professionals

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatibility**: Hostinger Business/Premium plans