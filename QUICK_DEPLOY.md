# 🚀 Deploy TruthStamp in 3 Steps

## **Easiest Method: Vercel (Recommended)**

### Step 1: Install Vercel
```bash
npm install -g vercel
```

### Step 2: Navigate to your app
```bash
cd /Users/aryanjain/Documents/javascript/truthstamp-dapp/truthstamp-app
```

### Step 3: Deploy!
```bash
vercel --prod
```

That's it! Your site will be live at: `https://truthstamp-dapp.vercel.app` 🎉

---

## **Or Use the Deployment Script**

Run this single command:
```bash
./deploy-web.sh
```

Then follow the on-screen instructions!

---

## **Quick Test Before Deploying**

Want to test the production build locally first?

```bash
# Build
cd truthstamp-app
npm run build

# Test locally
npx serve -s build
```

Open http://localhost:3000 in your browser!

---

## **Other Deployment Options**

### GitHub Pages
```bash
cd truthstamp-app
npm install --save-dev gh-pages
npm run deploy
```

### Netlify
```bash
npm install -g netlify-cli
cd truthstamp-app
netlify deploy --prod
```

---

## **Need Help?**

- 📖 Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🐛 Issues? Check browser console for errors
- 🔧 Build problems? Run `npm install` first

---

## **What Gets Deployed?**

Your deployed site includes:
- ✅ Submit Claims page
- ✅ Browse Claims (with auto-refresh)
- ✅ My Claims (with auto-refresh)
- ✅ Expert Dashboard (with badges)
- ✅ Claim Details (with guarantee & requirements)
- ✅ Expert review system
- ✅ Freighter wallet integration
- ✅ Stellar blockchain connection

All features fully functional! 🎊

---

**Ready?** Run: `vercel --prod` 🚀
