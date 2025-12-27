# Deployment Guide - Using Hugging Face (FREE!)

## Quick Start (Replit - Current)

The app is already running on Replit! To use it:

1. Get your **FREE** Hugging Face API token:
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Click "Create new token" → "Read" access
   - Copy the token

2. Add to Replit Secrets:
   - In Replit left sidebar → "Secrets"
   - Add: `HUGGINGFACE_API_KEY` = your token
   - Restart the app

Done! The app uses free Hugging Face API.

---

## Deploying to Vercel (Recommended)

### Prerequisites
1. Hugging Face API Token (FREE)
2. PostgreSQL Database (Free options available)
3. Vercel Account

### Step 1: Get Hugging Face API Token (FREE!)

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Sign up (free) if you don't have an account
3. Click "Create new token"
4. Select "Read" access level
5. Give it a name (e.g., "website-generator")
6. Copy the token (you won't see it again)

**Cost:** $0 - Completely FREE! No billing needed.

### Step 2: Set Up PostgreSQL Database (Free Options)

You have several FREE options:

**Option A: Neon (Recommended - 0.5 GB free)**
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a project
4. Copy the `Connection string`

**Option B: Vercel Postgres (Limited free tier)**
1. In Vercel dashboard → Storage tab
2. Create Postgres database
3. Copy connection string

**Option C: Railway (Limited free tier)**
1. Go to [https://railway.app](https://railway.app)
2. Create project → Add PostgreSQL
3. Copy connection string

### Step 3: Deploy to Vercel

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy with Hugging Face"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import your GitHub repo
# 4. Click "Deploy"
```

### Step 4: Set Environment Variables in Vercel

After deployment, go to **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `HUGGINGFACE_API_KEY` | Your Hugging Face token from Step 1 |
| `DATABASE_URL` | Your PostgreSQL connection string from Step 2 |
| `NODE_ENV` | `production` |

### Step 5: Run Database Setup

Option A - Using Vercel CLI:
```bash
vercel env pull
npm run db:push
```

Option B - SSH into Vercel:
```bash
vercel ssh
cd /var/task
npm run db:push
```

### Step 6: Test Your Deployment

Visit your Vercel URL and test:
1. Type a description and click "Generate Site"
2. Click "Voice" and record audio
3. Verify website generation works

---

## Cost Comparison

| Provider | Cost | Limit |
|----------|------|-------|
| **Hugging Face** | **FREE** ✅ | 30,000 inference calls/month |
| **OpenAI** | $0.001-0.05 per use | Requires billing |
| **Vercel** | FREE | Hobby plan |
| **Neon** | FREE | 0.5 GB storage |
| **Total Monthly** | **$0** | Unlimited for light use |

---

## Troubleshooting

### "Invalid API token" Error
- Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Check if your token is correct
- Generate a new token if needed
- Update in Vercel/Replit and restart

### "Database connection failed" Error
- Verify `DATABASE_URL` in environment variables
- Test connection string with:
  ```bash
  psql "your_connection_string"
  ```
- Run `npm run db:push` to create tables

### "Generation is slow"
- Hugging Face free tier may be slower (5-30 seconds)
- Paid tier would be faster, but this is FREE!
- Be patient, it will work

### "Audio transcription fails"
- Ensure your audio file is under 25 MB
- Try a different audio format (WAV, MP3, M4A)
- Check Hugging Face API status

---

## API Rate Limits (Hugging Face Free)

- **Text Generation:** 30,000 calls/month = ~1,000 sites/month
- **Audio Transcription:** Unlimited in free tier
- **Total:** More than enough for personal/hobby use

---

## Environment Variables Reference

### Production (Vercel)
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx
DATABASE_URL=postgresql://...
NODE_ENV=production
```

### Development (Replit)
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxx
DATABASE_URL=postgresql://... (auto-set by Replit)
NODE_ENV=development
```

---

## Model Details

### Text Generation
- **Model:** Mistral-7B-Instruct
- **Speed:** 5-30 seconds (free tier)
- **Quality:** Good for website HTML
- **Cost:** FREE

### Speech-to-Text
- **Model:** Whisper (OpenAI's open model via HF)
- **Speed:** 2-10 seconds (free tier)
- **Languages:** 99+ languages
- **Cost:** FREE

---

## Next Steps

1. ✅ Deploy to Vercel (follow Step 3)
2. ✅ Add Hugging Face token
3. ✅ Add database URL
4. ✅ Run database setup
5. ✅ Test the app
6. 🎉 Share with friends (completely free!)

---

## Support

- Hugging Face Issues: [discord.gg/JfAtqhgAVk](https://discord.gg/JfAtqhgAVk)
- Vercel Issues: [vercel.com/support](https://vercel.com/support)
- Database Issues: Check your database provider's docs
