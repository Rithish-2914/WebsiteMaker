# Complete Vercel Deployment Guide

## ✅ Prerequisites (5 minutes)

You need THREE things:

1. **GitHub Account** - [github.com](https://github.com)
2. **Vercel Account** - [vercel.com](https://vercel.com) (free tier OK)
3. **Hugging Face Token** - [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) (FREE!)
4. **PostgreSQL Database** - Free options: [Neon](https://neon.tech) or [Railway](https://railway.app)

---

## Step 1: Get Your Hugging Face Token (2 minutes)

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **"Create new token"** (top right)
3. Name it: `vercel-generator`
4. Select: **Read** access
5. Click **"Create token"**
6. **Copy the token** (you won't see it again!)
7. Save it somewhere safe (you'll need it in Step 4)

**Cost:** $0 - FREE forever!

---

## Step 2: Set Up PostgreSQL Database (5 minutes)

### Option A: Neon (Recommended - Easiest)

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign up"** (top right)
3. Sign up with GitHub (easiest)
4. Create a **new project** (you'll see a green button)
5. Go to **"Connection string"** tab
6. Copy the **"Connection string"** (looks like `postgresql://...`)
7. Save it (you'll need it in Step 4)

**Cost:** $0 - FREE (up to 0.5 GB)

### Option B: Railway

1. Go to [https://railway.app](https://railway.app)
2. Click **"Start New Project"**
3. Select **"PostgreSQL"** from templates
4. Wait for deployment (2-3 minutes)
5. Click on PostgreSQL → Click **"Connect"**
6. Copy the **"DATABASE_URL"**
7. Save it (you'll need it in Step 4)

**Cost:** $0 - FREE ($5/month free tier credit)

---

## Step 3: Push Code to GitHub (3 minutes)

```bash
# 1. Initialize git (if not already done)
git init
git add .
git commit -m "Ready for Vercel deployment"

# 2. Create a new repo on GitHub
# Go to: https://github.com/new
# Name it: website-generator (or whatever you like)
# Click "Create repository"

# 3. Push your code
git remote add origin https://github.com/YOUR_USERNAME/website-generator.git
git branch -M main
git push -u origin main
```

**Result:** Your code is on GitHub ✓

---

## Step 4: Deploy on Vercel (5 minutes)

### Step 4A: Connect to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"** (if needed, sign in with GitHub)
3. Find your repo: `website-generator`
4. Click **"Import"**
5. **Configure Project** (you'll see a form):
   - **Framework Preset:** Node.js
   - **Build Command:** `npm run build` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - Click **"Deploy"** (blue button)

**Wait 2-3 minutes for build...**

### Step 4B: Add Environment Variables (After Deploy Completes)

After the build completes:

1. Go to **"Settings"** tab (in Vercel dashboard)
2. Go to **"Environment Variables"** (left sidebar)
3. Add these TWO variables:

| Key | Value | Where to Get |
|-----|-------|------|
| `HUGGINGFACE_API_KEY` | `hf_xxxxxxxxxxxx` | From Step 1 (copy the token) |
| `DATABASE_URL` | `postgresql://...` | From Step 2 (copy the connection string) |

4. Click **"Save"** after each variable
5. Go to **"Deployments"** tab
6. Click **"Redeploy"** (re-trigger the build with new env vars)

**Wait 2-3 minutes for build...**

### Step 4C: Run Database Setup (After Redeploy)

Once the redeploy finishes:

1. Go to **"Settings"** → **"Build & Development Settings"**
2. Click **"Edit"** next to Build Command
3. Change it to:
   ```
   npm run build && npm run db:push
   ```
4. Click **"Save"**
5. Go to **"Deployments"** → Click **"Redeploy"** again

**Wait for build to complete (3-5 minutes)**

---

## ✅ Done! Your app is live!

1. Click the **"Visit"** button (or copy the URL from dashboard)
2. You'll see your website generator!
3. Test it:
   - Type a store description
   - Click "Generate Site"
   - Wait 5-30 seconds
   - Click "Open Website" to see the generated HTML

---

## Troubleshooting

### "Build failed" Error
- Check that `HUGGINGFACE_API_KEY` is correct
- Check that `DATABASE_URL` is correct and accessible
- Redeploy after fixing env vars

### "Site generation is slow"
- Hugging Face free tier can take 10-30 seconds
- This is normal! Just wait.

### "Database error"
- Make sure `DATABASE_URL` is correct
- Try creating a new database in Neon/Railway
- Copy the new connection string and update Vercel env var
- Redeploy

### "Audio transcription fails"
- Make sure `HUGGINGFACE_API_KEY` is correct
- Try re-recording shorter audio (< 30 seconds)
- Check Hugging Face status: [status.huggingface.co](https://status.huggingface.co)

---

## Your Vercel URL

Once deployed, your app is at:
```
https://your-project-name.vercel.app
```

Share this URL with anyone to let them generate websites for free!

---

## Cost Breakdown

| Service | Cost | Usage |
|---------|------|-------|
| Vercel Hosting | FREE | Unlimited bandwidth |
| Hugging Face API | FREE | 30K calls/month (~1000 sites) |
| PostgreSQL (Neon) | FREE | 0.5 GB storage |
| **Total Monthly** | **$0** | 100% FREE |

---

## Next: Update Your App

To update your app after deployment:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel will **automatically redeploy** your changes!

---

## Support

- **Hugging Face Issues:** [Discord](https://discord.gg/JfAtqhgAVk)
- **Vercel Issues:** [Support](https://vercel.com/support)
- **Database Issues:** Contact your database provider

---

## Summary Checklist

- [ ] Get Hugging Face token (Step 1)
- [ ] Create PostgreSQL database (Step 2)
- [ ] Push code to GitHub (Step 3)
- [ ] Deploy on Vercel (Step 4A)
- [ ] Add environment variables (Step 4B)
- [ ] Run database setup (Step 4C)
- [ ] Test the deployed app
- [ ] Share your URL!

**Total Time:** ~20 minutes

You're ready! 🚀
