@echo off
REM Global Business Directory Platform - Deployment Script for Windows
REM This script automates the build process for deployment

echo 🚀 Starting deployment build for Global Business Directory Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Run linting
echo 🔍 Running code linting...
npm run lint

if %errorlevel% neq 0 (
    echo ⚠️  Linting found issues, but continuing with build...
)

REM Build for production
echo 🏗️  Building for production...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Check if dist folder exists
if not exist "dist" (
    echo ❌ dist folder not found
    pause
    exit /b 1
)

echo ✅ Build files generated in dist\ folder

REM Display build information
echo.
echo 📊 Build Summary:
echo ==================
echo 📁 Build folder: %cd%\dist
echo 📄 Files generated:
dir dist

echo.
echo 🎉 Deployment build completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Upload all contents from the 'dist' folder to your Hostinger public_html directory
echo 2. Ensure the _redirects file is in the root of public_html
echo 3. Set file permissions: 644 for files, 755 for folders
echo 4. Test your website at your domain
echo.
echo 📚 For detailed instructions, see INSTALLATION_GUIDE.md
echo ✅ For deployment checklist, see DEPLOYMENT_CHECKLIST.md

pause