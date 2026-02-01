# ReedStreams Live Sports

A modern, high-performance sports streaming platform built with Next.js 16, featuring live match streaming, upcoming schedules, and comprehensive sports coverage.

## Features

- **Live Sports Streaming** - Watch live matches from multiple sports
- **Multi-Sport Support** - Coverage for Football, Basketball, Baseball, Hockey, MMA, and more
- **Upcoming Matches** - Browse and track upcoming games
- **Responsive Design** - Optimized for all devices
- **Server-Side Rendering** - Fast page loads and SEO optimization
- **API Architecture** - Clean separation of frontend and backend logic

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Analytics:** Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd reed-streams-live-sports
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
reed-streams-live-sports/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (backend)
│   │   ├── sports/        # Sports data endpoints
│   │   ├── matches/       # Match data endpoints
│   │   └── stream/        # Stream URL endpoints
│   ├── sports/            # Sports listing page
│   ├── live-matches/      # Live matches page
│   ├── match/[id]/        # Individual match page
│   ├── faq/               # FAQ page
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── layout/           # Header, Footer, etc.
│   ├── home/             # Home page components
│   ├── sports/           # Sports page components
│   ├── match/            # Match page components
│   └── ui/               # UI component library
├── lib/                   # Utility functions and types
├── styles/                # CSS files
├── public/                # Static assets
│   ├── images/           # Image files
│   └── scripts/          # Client-side scripts
└── types/                 # TypeScript type definitions
\`\`\`

## API Routes

- `GET /api/sports` - Get all available sports
- `GET /api/matches` - Get all live matches
- `GET /api/matches/[sportId]` - Get matches by sport
- `GET /api/stream/[source]/[id]` - Get stream URL for match

## Pages

- `/` - Home page with featured matches
- `/sports` - Browse all sports categories
- `/live-matches` - View all live matches
- `/match/[id]` - Watch individual match stream
- `/faq` - Frequently asked questions

## Performance Optimizations

- Server-side rendering for faster initial loads
- API route caching with revalidation
- Optimized image loading
- Code splitting and lazy loading
- Static asset optimization

## License

This project is private & proprietary.

## Support


For support, please contact the development team.


