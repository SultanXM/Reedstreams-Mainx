# ReedStreams Frontend

Next.js frontend for StreamD sports streaming platform.

## Features

- **StreamD API Integration** - Live matches, sports categories, streams
- **Real-time Views Counter** - Shows active viewers per match
- **Image Proxy** - Bypasses CORS for StreamD images
- **Source Switching** - Multiple stream sources (admin, alpha, bravo, etc.)
- **Responsive Design** - Works on desktop and mobile

## Views System

Views are tracked using a Rust backend deployed on Fly.io:
- **Backend URL**: `https://streamd-views.fly.dev`
- **Session Timeout**: 4 minutes
- **Auto-cleanup**: Expired sessions removed every 5 minutes

### Views API Endpoints

```
POST   /api/v1/views/:match_id              - Increment view
GET    /api/v1/views/:match_id/count        - Get view count
POST   /api/v1/views/:match_id/ping         - Keep session alive
POST   /api/v1/views/batch/count            - Batch get counts
```

### Views Display

- **Match Cards** - Shows eye icon with viewer count on sports grid
- **Live Matches** - Shows viewer count per match row
- **Match Page** - Shows viewer count below player

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## API Routes (Internal)

| Route | Description |
|-------|-------------|
| `/api/matches` | All matches (with poster filter) |
| `/api/matches/live` | Live matches (with poster filter) |
| `/api/matches/[sport]` | Sport-specific matches |
| `/api/sports` | Available sports |
| `/api/stream/[source]/[id]` | Stream sources |
| `/api/image-proxy` | CORS proxy for images |

## Environment Variables

```env
# Optional - defaults to https://streamed.pk/api
NEXT_PUBLIC_STREAMED_API_BASE_URL=https://streamed.pk/api
```

## Deployment

```bash
# Build and deploy
npm run build
# Deploy to your hosting platform (Vercel, etc.)
```

## Backend Repository

Views counter backend: `/streamd/backend/`
