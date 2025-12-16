# 🚀 Quick Start - Deploy in 5 Minutes!

Get your Bannada Daara website live on GitHub Pages in just a few steps.

## What You'll Need
- GitHub account
- 5 minutes of your time

## Steps

### 1️⃣ Upload to GitHub (2 minutes)

**Option A: Using GitHub Website (Easiest)**
1. Go to https://github.com/new
2. Repository name: `Bannadadara`
3. Keep it Public
4. Click "Create repository"
5. Click "uploading an existing file"
6. Drag ALL files from the BannadadaraFixed folder
7. Scroll down and click "Commit changes"

**Option B: Using Git Command Line**
```bash
cd BannadadaraFixed
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Bannadadara.git
git push -u origin main
```

### 2️⃣ Deploy (1 minute)

**On your computer:**
```bash
cd BannadadaraFixed
npm install
npm run deploy
```

Wait for it to finish...

### 3️⃣ Enable GitHub Pages (1 minute)

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under Source:
   - Branch: Select `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### 4️⃣ View Your Site! (1 minute)

Wait 2-3 minutes, then visit:
```
https://YOUR_USERNAME.github.io/Bannadadara/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🎉 That's It!

Your website is now live!

## Need to Make Changes?

1. Edit files locally
2. Run:
   ```bash
   git add .
   git commit -m "Updated content"
   git push origin main
   npm run deploy
   ```
3. Wait 2-3 minutes
4. Refresh your website

## Common Issues

### White screen?
- Check `vite.config.js` - make sure `base: "/Bannadadara/"` matches your repo name exactly

### Images not showing?
- Make sure logo.png is in the `public` folder

### Still not working?
- Check the full DEPLOYMENT_GUIDE.md for detailed troubleshooting

---

**🆘 Need Help?**

Read the detailed guides:
- 📖 README.md - Full documentation
- 🚀 DEPLOYMENT_GUIDE.md - Step-by-step deployment
- 📋 CHANGELOG.md - What's been fixed

**💚 Enjoy your new website!**
