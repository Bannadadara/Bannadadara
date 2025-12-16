# 🚀 Deployment Guide for Bannada Daara

This guide will walk you through deploying your Bannada Daara website to GitHub Pages.

## Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ Git installed on your computer
- ✅ Node.js installed (v16 or higher)

## Step-by-Step Deployment to GitHub Pages

### Step 1: Prepare Your Repository

1. **If this is a new repository**:
   ```bash
   cd BannadadaraFixed
   git init
   git add .
   git commit -m "Initial commit - Fixed and styled version"
   ```

2. **If updating existing repository**:
   ```bash
   cd BannadadaraFixed
   git add .
   git commit -m "Updated with fixes and styling"
   ```

### Step 2: Connect to GitHub

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `Bannadadara`
   - Keep it public
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Link your local repository**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Bannadadara.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure for GitHub Pages

The `vite.config.js` is already configured with:
```js
base: "/Bannadadara/"
```

**Important**: Make sure this matches your repository name exactly (case-sensitive).

### Step 5: Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:
1. Build your project (`npm run build`)
2. Create/update the `gh-pages` branch
3. Push the built files to GitHub

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### Step 7: Access Your Live Site

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/Bannadadara/
```

## Updating Your Site

Whenever you make changes:

```bash
# Make your changes to the code
git add .
git commit -m "Description of changes"
git push origin main

# Deploy the updates
npm run deploy
```

## Common Issues and Solutions

### Issue 1: White Screen After Deployment

**Solution**: Check that `base` in `vite.config.js` matches your repository name exactly.

```js
// Must match your repo name
base: "/Bannadadara/"
```

### Issue 2: Images Not Loading

**Solution**: Make sure images are in the `public` folder and referenced with `/` prefix:
```jsx
<img src="/logo.png" alt="Logo" />
```

### Issue 3: 404 Error

**Solution**: 
1. Check that GitHub Pages is enabled
2. Verify the `gh-pages` branch exists
3. Wait a few minutes for GitHub to process the deployment

### Issue 4: Changes Not Appearing

**Solution**:
1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Make sure you ran `npm run deploy` after making changes
3. Check that changes were committed to git before deploying

## Alternative Deployment Options

### Deploy to Netlify

1. **Sign up** at https://www.netlify.com/
2. **Connect your repository**:
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - **Important**: Update `vite.config.js`:
     ```js
     base: "/" // Change from "/Bannadadara/"
     ```
4. Click **Deploy site**

### Deploy to Vercel

1. **Sign up** at https://vercel.com/
2. **Import project**:
   - Click "Import Project"
   - Select your GitHub repository
3. **Configuration**:
   - Vercel auto-detects Vite
   - **Important**: Update `vite.config.js`:
     ```js
     base: "/" // Change from "/Bannadadara/"
     ```
4. Click **Deploy**

## Custom Domain Setup (Optional)

### For GitHub Pages:

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add a `CNAME` file to your `public` folder:
   ```
   www.yourdomain.com
   ```
3. In your domain registrar, add DNS records:
   - Type: CNAME
   - Host: www
   - Value: YOUR_USERNAME.github.io
4. In GitHub Settings → Pages → Custom domain, enter: `www.yourdomain.com`

## Testing Locally Before Deployment

Always test your build locally before deploying:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Open the URL shown (usually http://localhost:4173) to test.

## Troubleshooting Commands

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Clear npm cache if having issues
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check git remote
git remote -v

# Check current branch
git branch

# View gh-pages branch content
git checkout gh-pages
git checkout main  # Switch back
```

## Need Help?

If you encounter issues:

1. Check the error message carefully
2. Search for the error on Google or Stack Overflow
3. Review this guide again
4. Check GitHub Pages documentation: https://docs.github.com/en/pages
5. Check Vite documentation: https://vitejs.dev/

---

Good luck with your deployment! 🎉
