# TruthStamp Deployment Guide

## 🚀 **Quick Deployment Options**

Choose your preferred hosting platform:

1. **Vercel** - Easiest, Free, Recommended ⭐
2. **Netlify** - Easy, Free, Great for React
3. **GitHub Pages** - Free, Simple
4. **AWS S3 + CloudFront** - Professional, Scalable
5. **Your Own Server** - Full Control

---

## ⭐ **OPTION 1: VERCEL (RECOMMENDED)**

### Why Vercel?
- ✅ Free for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deploy from GitHub
- ✅ Zero configuration for React

### Step-by-Step Deployment:

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy from Terminal
```bash
# Navigate to your app directory
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app

# Login to Vercel
vercel login

# Deploy!
vercel
```

#### 3. Follow the prompts:
```
? Set up and deploy "truthstamp-app"? [Y/n] Y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] N
? What's your project's name? truthstamp-dapp
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

#### 4. Your site will be live!
```
✅ Production: https://truthstamp-dapp.vercel.app
```

### Auto-Deploy from GitHub:
1. Push your code to GitHub (already done!)
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo: `aryanjain281005/truthstamp-dapp`
5. Set root directory to: `truthstamp-app`
6. Click "Deploy"

Every time you push to GitHub, Vercel auto-deploys! 🎉

---

## 🌐 **OPTION 2: NETLIFY**

### Step-by-Step:

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Build your app
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app
npm run build
```

#### 3. Deploy
```bash
# Login
netlify login

# Deploy
netlify deploy --prod
```

#### 4. Follow prompts:
```
? What would you like to do? Create & configure a new site
? Team: Your Team
? Site name: truthstamp-dapp
? Publish directory: build
```

### OR use Netlify Dashboard:
1. Go to https://app.netlify.com
2. Drag and drop the `build` folder
3. Done! Site is live

### Connect to GitHub:
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Choose GitHub → Select repo: `truthstamp-dapp`
4. Set base directory: `truthstamp-app`
5. Build command: `npm run build`
6. Publish directory: `build`
7. Click "Deploy site"

---

## 📄 **OPTION 3: GITHUB PAGES**

### Step-by-Step:

#### 1. Install gh-pages package
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app
npm install --save-dev gh-pages
```

#### 2. Update package.json
Add these lines to `package.json`:

```json
{
  "homepage": "https://aryanjain281005.github.io/truthstamp-dapp",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### 3. Deploy
```bash
npm run deploy
```

#### 4. Enable GitHub Pages
1. Go to: https://github.com/aryanjain281005/truthstamp-dapp/settings/pages
2. Source: Select `gh-pages` branch
3. Click "Save"

Your site will be live at:
```
https://aryanjain281005.github.io/truthstamp-dapp
```

---

## ☁️ **OPTION 4: AWS S3 + CLOUDFRONT**

### Professional, Scalable Hosting

#### 1. Build your app
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app
npm run build
```

#### 2. Install AWS CLI
```bash
brew install awscli  # macOS
aws configure
```

#### 3. Create S3 Bucket
```bash
aws s3 mb s3://truthstamp-dapp
aws s3 website s3://truthstamp-dapp --index-document index.html
```

#### 4. Upload files
```bash
cd build
aws s3 sync . s3://truthstamp-dapp --acl public-read
```

#### 5. Setup CloudFront (Optional)
- Create CloudFront distribution
- Point to S3 bucket
- Enable HTTPS
- Add custom domain

---

## 🖥️ **OPTION 5: YOUR OWN SERVER (VPS)**

### Deploy to your own server

#### 1. Build your app
```bash
npm run build
```

#### 2. Upload to server
```bash
# Using SCP
scp -r build/* user@your-server.com:/var/www/html/

# Or using rsync
rsync -avz build/* user@your-server.com:/var/www/html/
```

#### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name truthstamp.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 4. Enable HTTPS with Let's Encrypt
```bash
sudo certbot --nginx -d truthstamp.com
```

---

## 🛠️ **PRE-DEPLOYMENT CHECKLIST**

Before deploying, make sure:

### 1. Build Successfully
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app
npm run build
```

Should complete without errors!

### 2. Environment Variables
Create `.env.production` file:
```env
REACT_APP_NETWORK=TESTNET
REACT_APP_RPC_URL=https://soroban-testnet.stellar.org:443
REACT_APP_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

### 3. Update Contract Addresses
If you redeploy contracts, update `src/utils/contracts.ts`:
```typescript
export const CLAIM_REGISTRY_CONTRACT = 'YOUR_CONTRACT_ID';
export const EXPERT_REGISTRY_CONTRACT = 'YOUR_CONTRACT_ID';
export const REVIEW_CONSENSUS_CONTRACT = 'YOUR_CONTRACT_ID';
```

### 4. Test Production Build Locally
```bash
npm run build
npx serve -s build
```

Visit http://localhost:3000 and test everything!

---

## 📦 **BUILD OPTIMIZATION**

### Reduce Bundle Size
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build
```

### Enable Code Splitting
Already enabled in React! Check `build/static/js/` for split chunks.

### Compress Assets
Most hosting platforms (Vercel, Netlify) do this automatically!

---

## 🔒 **SECURITY CONSIDERATIONS**

### 1. Environment Variables
- Never commit `.env` files
- Use platform-specific environment variables
- Store sensitive data securely

### 2. HTTPS
- Always use HTTPS in production
- Most platforms provide free SSL certificates
- Force HTTPS redirects

### 3. CSP Headers
Add Content Security Policy headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## 🌍 **CUSTOM DOMAIN SETUP**

### After deploying, add your custom domain:

#### For Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your domain: `truthstamp.com`
4. Update DNS records at your registrar:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Netlify:
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Add DNS records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

---

## 📊 **POST-DEPLOYMENT MONITORING**

### 1. Analytics
Add Google Analytics or Plausible:
```bash
npm install react-ga4
```

### 2. Error Tracking
Add Sentry for error monitoring:
```bash
npm install @sentry/react
```

### 3. Performance Monitoring
Use Vercel Analytics or Lighthouse CI

---

## 🚀 **QUICK START - DEPLOY NOW!**

### Fastest Method (Vercel):

```bash
# 1. Install Vercel
npm install -g vercel

# 2. Navigate to your app
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app

# 3. Deploy!
vercel --prod

# That's it! Your site is live! 🎉
```

You'll get a URL like: `https://truthstamp-dapp.vercel.app`

---

## 🔧 **TROUBLESHOOTING**

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules build
npm install
npm run build
```

### Blank Page After Deploy
- Check browser console for errors
- Verify routing is configured correctly
- Check if all assets loaded properly

### 404 on Refresh
Add `_redirects` file (Netlify) or `vercel.json` (Vercel):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Slow Loading
- Enable compression
- Optimize images
- Use lazy loading
- Enable CDN

---

## 📝 **DEPLOYMENT COMMANDS SUMMARY**

```bash
# Build
npm run build

# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy

# AWS S3
aws s3 sync build/ s3://your-bucket --acl public-read
```

---

## ✅ **READY TO DEPLOY?**

Choose your platform and follow the steps above!

**Recommended for beginners:** Vercel (easiest, free, automatic)
**Recommended for advanced:** AWS (scalable, professional)

Your app is production-ready! 🎉
