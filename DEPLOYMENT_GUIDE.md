# Deployment Guide

## Deploying to Vercel

### Prerequisites
1. OpenAI API Key
2. PostgreSQL Database
3. Vercel Account

### Step 1: Get OpenAI API Key
1. Go to [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Copy it (you won't see it again)
4. Make sure you have credits or billing set up on your OpenAI account

### Step 2: Set Up PostgreSQL Database
You have several options:

**Option A: Vercel Postgres (Recommended)**
1. In Vercel dashboard, go to "Storage" tab
2. Create a new Postgres database
3. Copy the `POSTGRES_URL` connection string

**Option B: Neon (Free tier available)**
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up and create a project
3. Copy the connection string

**Option C: Railway, Supabase, or other providers**
- Follow their setup guides and copy the connection string

### Step 3: Deploy to Vercel

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Import project in Vercel
# - Go to https://vercel.com/new
# - Select your GitHub repo
# - Click "Deploy"

# 3. Set Environment Variables in Vercel
# In Vercel Dashboard → Settings → Environment Variables, add:
```

| Variable | Value | Example |
|----------|-------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk_...` |
| `DATABASE_URL` | Your PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | production | `production` |

### Step 4: Run Database Migrations

After deployment, SSH into your Vercel environment or run:

```bash
npm run db:push
```

Or use Vercel CLI:
```bash
vercel env pull
npm run db:push
```

### Step 5: Test Your Deployment

Visit your Vercel URL and test:
1. Type a website description and click "Generate Site"
2. Click the "Voice" button and record audio
3. Verify the generated website appears

## Troubleshooting

### "Missing API key" Error
- Check that `OPENAI_API_KEY` is set in Vercel Environment Variables
- Make sure it's the correct key from OpenAI
- Restart the deployment after adding the key

### "Database connection failed" Error
- Check that `DATABASE_URL` is correct
- Make sure your database is running and accessible
- Run `npm run db:push` to create tables

### "No audio transcription" Error
- Verify `OPENAI_API_KEY` has access to Whisper API
- Check OpenAI account has available credits

## Cost Estimate

Monthly costs for typical usage:

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Included | $0 |
| OpenAI GPT-5 | $0 | ~$0.01-0.05 per generation |
| OpenAI Whisper | $0 | ~$0.001 per minute of audio |
| PostgreSQL | Included (Vercel) | $0 |

**Example:** 100 website generations + 10 voice transcriptions = ~$1-2

## Environment Variables Reference

### Required for Production
- `OPENAI_API_KEY` - Your OpenAI API key
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`

### Optional
- `AI_INTEGRATIONS_OPENAI_API_KEY` - For Replit deployments only
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - For Replit deployments only

## Updating Your App

After deployment, to update your code:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically redeploy your changes.

## Support

- OpenAI Issues: [help.openai.com](https://help.openai.com)
- Vercel Issues: [vercel.com/support](https://vercel.com/support)
- Database Issues: Check your database provider's documentation
