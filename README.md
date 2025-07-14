# Global Business Directory Platform

A comprehensive PWA business directory platform with global reach, advanced search capabilities, automated data ingestion, and multi-role management system.

## 🌟 Features

- **Global Business Listings**: Support for businesses worldwide with location hierarchy
- **Advanced Search**: Location-based search with map integration and category filtering
- **Multi-Role System**: Guest users, Business owners, Moderators, and Super Admin
- **PWA Capabilities**: Offline support and mobile app-like experience
- **Automated Data Ingestion**: Bulk business data import and management
- **Real-time Analytics**: Business listing performance tracking
- **Responsive Design**: Optimized for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Local Development
```bash
# Clone or download the project
git clone <repository-url>
cd global-business-directory-ju3clqoy

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📦 Export & Deployment

### Method 1: Download from Blink (Recommended)
1. Go to [blink.new](https://blink.new)
2. Open your Global Business Directory project
3. Click **"Download Code"** button in the top navigation
4. Extract the downloaded ZIP file

### Method 2: Build from Source
```bash
# Build for production
npm run build

# Files will be generated in 'dist/' folder
```

### Automated Build Script
For convenience, use the provided build scripts:

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```cmd
deploy.bat
```

## 🌐 Hostinger Deployment Guide

### Step 1: Prepare Files
1. Run the build process (see above)
2. Locate the `dist/` folder with your built files

### Step 2: Upload to Hostinger
1. **Access Hostinger Control Panel**
   - Log in to your Hostinger account
   - Go to "File Manager"
   - Navigate to your domain's `public_html` folder

2. **Upload Files**
   - Delete existing files in `public_html` (if any)
   - Upload ALL contents from the `dist/` folder
   - Ensure file structure:
     ```
     public_html/
     ├── index.html
     ├── assets/
     ├── favicon.svg
     ├── _redirects
     └── vite.svg
     ```

3. **Set Permissions**
   - Files: 644
   - Folders: 755

### Step 3: Configure URL Rewriting
Add this `.htaccess` file to your `public_html` root:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Step 4: Enable SSL
1. In Hostinger control panel, go to "SSL"
2. Enable "Force HTTPS"
3. Wait for SSL certificate activation

## 📋 Deployment Checklist

Use the provided `DEPLOYMENT_CHECKLIST.md` for a comprehensive deployment guide.

### Quick Verification
- [ ] Website loads at your domain
- [ ] Search functionality works
- [ ] Navigation is responsive
- [ ] No console errors
- [ ] HTTPS is enabled

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + ShadCN UI
- **Backend**: Blink SDK (Auth, Database, Storage)
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── Navbar.tsx      # Navigation component
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── SearchResults.tsx
│   ├── BusinessDetail.tsx
│   ├── Dashboard.tsx   # User dashboard
│   └── AdminPanel.tsx  # Admin interface
├── blink/              # Blink SDK configuration
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── utils/              # Helper functions
```

## 🔧 Configuration

### Blink SDK Setup
The project uses Blink SDK for backend services. Configuration is in `src/blink/client.ts`:

```typescript
import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'global-business-directory-ju3clqoy',
  authRequired: true
})
```

### Environment Variables
No manual environment setup needed - Blink SDK handles all configuration automatically.

## 🎨 Customization

### Styling
- Colors: Edit `src/index.css` for custom color palette
- Components: Modify components in `src/components/`
- Layout: Update page components in `src/pages/`

### Features
- Add new pages in `src/pages/`
- Create custom components in `src/components/`
- Extend functionality with Blink SDK features

## 📚 Documentation

- **Installation Guide**: `INSTALLATION_GUIDE.md` - Comprehensive setup instructions
- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment verification
- **Blink SDK Docs**: Available in your Blink dashboard

## 🐛 Troubleshooting

### Common Issues

**Blank Page After Deployment**
- Check browser console for errors
- Verify all files uploaded correctly
- Ensure proper file permissions

**404 Errors on Page Refresh**
- Add `.htaccess` file with URL rewriting rules
- Verify `_redirects` file is present

**Slow Loading**
- Enable Hostinger CDN
- Optimize images
- Check server location

### Getting Help
- **Hostinger Support**: 24/7 live chat
- **Blink Support**: support@blink.new
- **Documentation**: Check `INSTALLATION_GUIDE.md`

## 📄 License

This project is built with Blink and follows standard web development practices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using [Blink](https://blink.new) - The AI Full-Stack Engineer**