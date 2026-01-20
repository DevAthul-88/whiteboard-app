# Realtime Whiteboard App

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)

A modern, realtime collaborative whiteboard and chat application built with **Next.js**, **Supabase**, **React-Konva**, **Chakra UI**, **TypeScript**, and **Docker**. Designed for teams that need fast, low-friction collaboration with persistent rooms, drawing tools, and integrated chat.

---

## 🎯 Live Demo

**[View Live Demo →](https://realtimewhiteboardv0.netlify.app/)**

## Features

- **Realtime whiteboard**  
  Draw, sketch, and annotate together on a shared canvas with low-latency updates.
- **Realtime chat**  
  Room-based chat panel for discussing ideas alongside the board.
- **Room-based collaboration**  
  Create and share unique room links to collaborate with specific teams or sessions.
- **User presence & awareness**  
  See which users are in a room and reflect their actions on the board.
- **Responsive UI**  
  Layout optimized for desktop and large tablets using Chakra UI.
- **Authentication**  
  Gate access to boards and rooms with Supabase Auth and Next.js middleware.
- **Containerized deployment**  
  First-class Docker and Docker Compose support for reproducible builds and deployment.

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Language:** TypeScript
- **Realtime backend:** Supabase Realtime & PostgreSQL
- **Auth:** Supabase Auth
- **Canvas rendering:** React-Konva (Konva.js)
- **UI library:** Chakra UI
- **Styling:** Global CSS + Chakra theming
- **Tooling:** ESLint, PostCSS
- **Runtime & packaging:** Node.js, Docker, Docker Compose

---

## Project Structure

```text
.
├── public/                  # Static assets (images, icons, etc.)
├── src/
│   └── app/
│       ├── (dashboard)/     # Dashboard-related routes (e.g. user boards/rooms)
│       ├── (room)/          # Room pages and whiteboard views
│       ├── auth/            # Authentication pages (sign-in, sign-up, etc.)
│       ├── components/      # Shared UI components (canvas, chat, layout, etc.)
│       ├── docs/            # Public documentation/help pages
│       ├── lib/             # Client setup, Supabase utilities, helpers
│       ├── privacy/         # Privacy policy page
│       ├── terms/           # Terms & conditions page
│       ├── favicon.ico
│       ├── globals.css      # Global styles
│       ├── layout.tsx       # Root layout (App Router)
│       └── page.tsx         # Landing page
├── .dockerignore
├── .env.local               # Local environment variables (not committed)
├── .gitignore
├── db_query.md              # Database schema / query notes
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Multi-stage Docker build
├── eslint.config.mjs        # ESLint configuration
├── middleware.ts            # Next.js middleware (auth, routing, etc.)
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```


---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)
- A Supabase project (URL + anon key)
- Docker \& Docker Compose (optional, for containerized runs)


### Environment Variables

Create a `.env.local` file in the project root:

```env
# Public Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-only (if used for backend/admin tasks)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Do **not** commit this file to version control.

---

## Local Development

Install dependencies and start the dev server:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open:

```text
http://localhost:3000
```

You should see the landing page, from which you can authenticate (if enabled), access the dashboard, and create/join rooms.

---

## Docker \& Deployment

### Build and Run with Docker

```bash
# Build image with public envs baked in (optional)
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
  -t realtime-whiteboard .

# Run container using local env file
docker run -p 3000:3000 --env-file .env.local realtime-whiteboard
```


### Using Docker Compose

```bash
docker-compose up --build
```

This will:

- Build the app image using the provided `Dockerfile`
- Expose the app on port `3000`
- Inject environment variables from `.env.local` (or your Compose config)

---

## Core Concepts

### Realtime Whiteboard

- Canvas rendering is handled via **React-Konva**, which wraps Konva’s 2D canvas API with React components.
- Drawing actions (e.g., strokes, shapes) are persisted and/or broadcast via Supabase, allowing multiple users to see updates in realtime.


### Realtime Chat

- Each room has an associated chat stream.
- Messages are stored in a Supabase table and optionally broadcast using Supabase Realtime so that all connected clients see updates instantly.


### Rooms \& Dashboard

- Users can create new rooms from the dashboard area and receive a shareable URL.
- Each room route under `(room)` encapsulates:
    - Whiteboard instance
    - Chat panel
    - Presence and collaboration logic


### Authentication \& Middleware

- Supabase Auth is used for authentication.
- Next.js middleware (`middleware.ts`) can protect routes and redirect unauthenticated users to the auth flow.

---

## Available Scripts

Common npm scripts:

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```
---
## 🔒 Privacy & Security

- **GDPR Compliant**: User data export/deletion available
- **Data Storage**: All data stored in EU region (Supabase EU)
- **Authentication**: Secure session management via Supabase Auth
- **No Tracking**: No third-party analytics without consent

Please review our [Privacy Policy](https://realtimewhiteboardv0.netlify.app/privacy) for details.
---
## 🔧 Troubleshooting

### Common Issues

**Realtime not working?**
- Check Supabase project is active
- Verify RLS policies are set correctly
- Check browser console for WebSocket errors

**Canvas not rendering?**
- Ensure browser supports HTML5 Canvas
- Check React-Konva compatibility

**Docker build fails?**
- Verify Node.js version in Dockerfile matches local
- Clear Docker cache: `docker system prune -a`
---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please keep PRs focused and add tests or updates to documentation where relevant.

---

## License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.
