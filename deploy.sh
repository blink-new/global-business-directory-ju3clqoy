#!/bin/bash

# Global Business Directory Platform - Deployment Script
# This script automates the build process for deployment

echo "🚀 Starting deployment build for Global Business Directory Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run linting
echo "🔍 Running code linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting found issues, but continuing with build..."
fi

# Build for production
echo "🏗️  Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist folder exists and has content
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found"
    exit 1
fi

if [ -z "$(ls -A dist)" ]; then
    echo "❌ dist folder is empty"
    exit 1
fi

echo "✅ Build files generated in dist/ folder"

# Display build information
echo ""
echo "📊 Build Summary:"
echo "=================="
echo "📁 Build folder: $(pwd)/dist"
echo "📄 Files generated:"
ls -la dist/

echo ""
echo "🎉 Deployment build completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Upload all contents from the 'dist' folder to your Hostinger public_html directory"
echo "2. Ensure the _redirects file is in the root of public_html"
echo "3. Set file permissions: 644 for files, 755 for folders"
echo "4. Test your website at your domain"
echo ""
echo "📚 For detailed instructions, see INSTALLATION_GUIDE.md"
echo "✅ For deployment checklist, see DEPLOYMENT_CHECKLIST.md"