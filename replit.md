# AI Website Generator

## Overview

This is an AI-powered website generator that creates single-file HTML websites based on user prompts. Users can describe what they want (e.g., "a modern clothing store with a dark theme") via text or voice input, and the system generates complete HTML with embedded CSS and JavaScript. The app uses Hugging Face's free API (Mistral-7B for text generation, Whisper for speech-to-text) to power the AI features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for UI transitions
- **Build Tool**: Vite with path aliases (`@/` for client src, `@shared/` for shared code)

The frontend follows a component-based architecture with pages in `client/src/pages/`, reusable UI components in `client/src/components/ui/`, and custom hooks in `client/src/hooks/`.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js (tsx for development, esbuild bundle for production)
- **API Pattern**: REST endpoints under `/api/` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL

The server handles site generation requests asynchronously. When a user submits a prompt, a site record is created with "pending" status, then the AI generates HTML code and updates the record to "completed" or "failed".

### Data Storage
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with `npm run db:push`

Main table is `sites` with fields: id, prompt, code (generated HTML), status (pending/completed/failed), createdAt.

### AI Integration
- **Provider**: Hugging Face Inference API (free tier)
- **Text Generation**: Mistral-7B-Instruct-v0.1 for HTML generation
- **Speech-to-Text**: OpenAI Whisper-small for voice input transcription
- **Environment Variable**: `HUGGINGFACE_API_KEY` (or falls back to `AI_INTEGRATIONS_OPENAI_API_KEY`)

### Key Design Decisions

1. **Single-file HTML output**: Generated sites are self-contained HTML with embedded CSS/JS, making them easy to preview and download.

2. **Polling for status**: The frontend polls the site endpoint every 2 seconds while status is "pending", allowing for async generation without WebSockets.

3. **Local ID storage**: Since there's no list endpoint, site IDs are stored in localStorage to show recent generations.

4. **Shared code pattern**: Types and schemas in `shared/` folder are used by both client and server, ensuring type safety across the stack.

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (Neon, Railway, or Vercel Postgres recommended)
- `HUGGINGFACE_API_KEY` - Free API token from huggingface.co/settings/tokens

### Third-Party Services
- **Hugging Face**: Free AI inference API for text and audio processing
- **PostgreSQL**: Database (free tiers available at Neon, Railway, Vercel)

### Optional Replit Integrations
The codebase includes pre-built integrations in `server/replit_integrations/`:
- Chat storage and routes (OpenAI-based conversations)
- Image generation (gpt-image-1 model)
- Batch processing utilities with rate limiting

These are available but not currently used by the main site generation flow.