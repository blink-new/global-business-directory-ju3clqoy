# Deployment Checklist for Global Business Directory Platform

## Pre-Deployment Checklist

### ✅ Development Environment
- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Local development server working (`npm run dev`)
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Responsive design verified

### ✅ Build Process
- [ ] Production build successful (`npm run build`)
- [ ] Build files generated in `dist/` folder
- [ ] Build size optimized (check bundle analyzer if needed)
- [ ] All assets properly referenced

### ✅ Hostinger Account Setup
- [ ] Hostinger hosting account active
- [ ] Domain configured and pointing to Hostinger
- [ ] SSL certificate enabled
- [ ] File Manager access confirmed

## Deployment Steps

### Step 1: Build Production Files
```bash
# Navigate to project directory
cd global-business-directory-ju3clqoy

# Install dependencies
npm install

# Create production build
npm run build

# Verify build contents
ls -la dist/
```

### Step 2: Upload to Hostinger
- [ ] Access Hostinger File Manager
- [ ] Navigate to public_html folder
- [ ] Clear existing files (if any)
- [ ] Upload all contents from `dist/` folder
- [ ] Verify file structure matches expected layout

### Step 3: Configure Server
- [ ] Ensure `_redirects` file is in root
- [ ] Set proper file permissions (644 for files, 755 for folders)
- [ ] Configure .htaccess if needed for URL rewriting

### Step 4: Test Deployment
- [ ] Visit your domain
- [ ] Test homepage loading
- [ ] Test navigation between pages
- [ ] Test search functionality
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors

## Post-Deployment Checklist

### ✅ Functionality Testing
- [ ] Homepage loads correctly
- [ ] Search bar works
- [ ] Business listings display
- [ ] User registration/login works
- [ ] Add listing form functions
- [ ] Admin panel accessible (if applicable)
- [ ] All internal links work
- [ ] External links open correctly

### ✅ Performance Testing
- [ ] Page load speed acceptable (< 3 seconds)
- [ ] Images load properly
- [ ] No broken links
- [ ] Mobile performance good
- [ ] PWA features work (if applicable)

### ✅ SEO & Analytics
- [ ] Meta tags present
- [ ] Sitemap accessible
- [ ] Google Search Console configured
- [ ] Analytics tracking working (if configured)
- [ ] Social media sharing works

### ✅ Security & Compliance
- [ ] HTTPS enabled and working
- [ ] No mixed content warnings
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Cookie policy accessible (if applicable)

## Troubleshooting Quick Fixes

### Issue: Blank Page
**Quick Fix:**
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Check file permissions
4. Ensure index.html is in root of public_html

### Issue: 404 on Page Refresh
**Quick Fix:**
1. Add .htaccess file to public_html:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Issue: Slow Loading
**Quick Fix:**
1. Enable Hostinger CDN
2. Optimize images
3. Check server location
4. Enable compression

### Issue: Authentication Problems
**Quick Fix:**
1. Verify Blink project ID in `src/blink/client.ts`
2. Check domain whitelist in Blink dashboard
3. Ensure HTTPS is enabled

## Emergency Rollback Plan

If deployment fails:
1. **Backup Current**: Download current public_html contents
2. **Restore Previous**: Upload previous working version
3. **Test Quickly**: Verify basic functionality
4. **Debug Offline**: Fix issues in development environment
5. **Redeploy**: Follow checklist again

## Support Contacts

### Hostinger Support
- **Live Chat**: Available 24/7 in control panel
- **Email**: Through support ticket system
- **Knowledge Base**: help.hostinger.com

### Blink Support
- **Documentation**: In Blink dashboard
- **Community**: Discord server
- **Email**: support@blink.new

## Final Verification

Before marking deployment complete:
- [ ] All checklist items completed
- [ ] Website accessible from multiple devices
- [ ] Core functionality working
- [ ] No critical errors in browser console
- [ ] Performance acceptable
- [ ] Backup of working deployment created

**Deployment Date**: ___________
**Deployed By**: ___________
**Version**: ___________
**Notes**: ___________