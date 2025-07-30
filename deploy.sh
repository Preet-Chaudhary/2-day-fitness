#!/bin/bash

# Quick deployment script for 2-Day Fitness Website
echo "🚀 Starting deployment process for 2-Day Fitness..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Linting code..."
npm run lint

echo "🏗️ Building frontend for production..."
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build output is in the 'dist' folder"

echo ""
echo "🎯 Next steps:"
echo "1. Deploy backend to Render/Railway using the backend folder"
echo "2. Set up environment variables in your hosting platform"
echo "3. Update VITE_API_URL in Netlify environment variables"
echo "4. Trigger a new Netlify deploy"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
