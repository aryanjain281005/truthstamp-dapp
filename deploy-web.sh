#!/bin/bash

# TruthStamp Web App Deployment Script
echo "🚀 TruthStamp Web App Deployment"
echo "=================================="
echo ""

# Navigate to app directory
cd "$(dirname "$0")/truthstamp-app"

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building production bundle..."
CI=false npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build size:"
    du -sh build/
    echo ""
    echo "📁 Build folder contents:"
    ls -lh build/
    echo ""
    echo "🎯 Your app is ready to deploy!"
    echo ""
    echo "Choose a deployment method:"
    echo ""
    echo "1️⃣  VERCEL (Recommended - Easiest):"
    echo "   npm install -g vercel"
    echo "   vercel --prod"
    echo ""
    echo "2️⃣  NETLIFY:"
    echo "   npm install -g netlify-cli"
    echo "   netlify deploy --prod"
    echo ""
    echo "3️⃣  GITHUB PAGES:"
    echo "   npm run deploy"
    echo ""
    echo "4️⃣  Test locally first:"
    echo "   npx serve -s build"
    echo "   Then open: http://localhost:3000"
    echo ""
    echo "📖 Full deployment guide: DEPLOYMENT_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Build failed! Check errors above."
    exit 1
fi
