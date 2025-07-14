# 🚀 Quick Deploy Guide - Global Business Directory

## Export Your Project

### Option 1: Download from Blink (Easiest)
1. Go to [blink.new](https://blink.new)
2. Open your project
3. Click **"Download Code"** button
4. Extract ZIP file

### Option 2: Build Locally
```bash
npm install
npm run build
```

## Deploy to Hostinger (5 Minutes)

### 1. Access Hostinger
- Login to Hostinger control panel
- Go to **File Manager**
- Open **public_html** folder

### 2. Upload Files
- Delete existing files in public_html
- Upload **ALL** contents from `dist/` folder
- Verify these files are present:
  - `index.html`
  - `assets/` folder
  - `_redirects` file
  - `favicon.svg`

### 3. Fix URL Routing
Create `.htaccess` file in public_html:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 4. Enable HTTPS
- Go to **SSL** in Hostinger panel
- Enable **Force HTTPS**
- Wait 5-10 minutes for activation

### 5. Test Your Site
- Visit your domain
- Test search functionality
- Check mobile responsiveness
- Verify no console errors

## ✅ Success Checklist
- [ ] Website loads correctly
- [ ] Search bar works
- [ ] Navigation functions
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No 404 errors on page refresh

## 🆘 Quick Fixes

**Blank Page?**
- Check browser console for errors
- Verify all files uploaded correctly

**404 on Page Refresh?**
- Add the .htaccess file above
- Ensure _redirects file is present

**Slow Loading?**
- Enable Hostinger CDN in control panel
- Check your internet connection

## 📞 Need Help?
- **Hostinger**: 24/7 live chat support
- **Blink**: support@blink.new
- **Detailed Guide**: See `INSTALLATION_GUIDE.md`

---
**Total Time: ~5-10 minutes** ⏱️