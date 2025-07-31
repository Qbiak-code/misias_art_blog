# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Development Tracking

**IMPORTANT**: Always read `/.context/PROJECT_PROGRESS.md` alongside this file before starting work. 

- **CLAUDE.md** (this file): Technical architecture, commands, and project structure
- **PROJECT_PROGRESS.md**: Current development state, active issues, completed work, and session context

This dual-documentation system ensures complete context for AI agents across sessions.

## Project Overview

This is a full-stack art portfolio blog for a young artist to showcase paintings and digital art. The platform features moderated commenting and contact forms, with the artist managing content and her father moderating interactions.

## Project Architecture

**Backend**: Strapi 5.20.0 CMS providing API for content management
- Location: `backend/`
- Database: SQLite (development) / PostgreSQL (production)
- Content types: artwork, artist-statement, comment, contact-message
- User roles: Artist (content creation), Moderator (comment/message approval)

**Frontend**: Nuxt 4.0.2 application with water colour aesthetic
- Location: `frontend/`
- UI Framework: @nuxt/ui with Tailwind CSS v4.0
- Image handling: @nuxt/image + Cloudinary integration
- Design theme: Soft, flowing water colour tones with ample white space

## Development Commands

### Backend (Strapi)
```bash
cd backend
npm run dev          # Start development server with auto-reload (port 1337)
npm run build        # Build admin panel
npm run start        # Start production server
npm run develop      # Alias for dev command
```

### Frontend (Nuxt)
```bash
cd frontend
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

## Content Types Structure

### Artwork (Collection Type)
- title (String, required, unique)
- description (Rich Text)
- category (Enum: Paintings, Digital Art, Experimental)
- image (Media, required, single)
- additionalImages (Media, multiple, optional)
- slug (UID, auto-generated)
- featured (Boolean, default: false)
- published (Boolean)
- comments (Relation: oneToMany with Comment)

### Comment (Collection Type)
- content (Text, max 1000 chars)
- authorName (String, max 100 chars)
- authorEmail (Email, private)
- approved (Boolean, default: false)
- artwork (Relation: manyToOne with Artwork)
- ipAddress (String, private, for moderation)

### Contact Message (Collection Type)
- name (String, max 100 chars)
- email (Email)
- subject (String, optional, max 200 chars)
- message (Text, max 2000 chars)
- read (Boolean, default: false)
- replied (Boolean, default: false)

### Artist Statement (Single Type)
- statement (Rich Text)
- biography (Rich Text)
- profileImage (Media, single, optional)

## Environment Configuration

### Backend (.env)
```bash
# Required for Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=salt
ADMIN_JWT_SECRET=secret
TRANSFER_TOKEN_SALT=transfer-salt
JWT_SECRET=jwt-secret

# Database (SQLite local, PostgreSQL production)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Services
CLOUDINARY_NAME=name
CLOUDINARY_KEY=key
CLOUDINARY_SECRET=secret
RESEND_API_KEY=key
```

### Frontend (.env)
```bash
NUXT_PUBLIC_STRAPI_URL=http://localhost:1337
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

## API Endpoints

### Public (No Auth)
- `GET /api/artworks` - List published artworks
- `GET /api/artworks/:slug` - Single artwork with approved comments
- `GET /api/artworks/category/:category` - Filter by category
- `GET /api/artist-statement` - Artist info
- `POST /api/comments` - Submit comment (awaits moderation)
- `POST /api/contact-messages` - Submit contact message

### Admin (Auth Required)
- Full CRUD for all content types
- Comment moderation interface
- Contact message management

## Water Colour Design System

### Color Palette
- Sky Blues: #f0f9ff to #0ea5e9
- Lavender Purples: #faf5ff to #a855f7
- Soft Pinks: #fdf2f8 to #ec4899
- Warm Yellows: #fffbeb to #f59e0b
- Mint Greens: #f0fdf4 to #22c55e
- Neutrals: Paper white, canvas cream, charcoal

### Key Components
- watercolour-card: Translucent cards with backdrop blur
- watercolour-button: Gradient buttons with hover effects
- category-filter: Rounded filter buttons
- floating-element: Subtle floating animation
- artwork-grid: Responsive masonry-style grid

## Security Features

### Rate Limiting
- Comments: 5 per minute per IP
- Contact Messages: 3 per minute per IP
- General API: 100 requests per minute

### Spam Protection
- Email validation, content length limits
- IP address logging for moderation
- Manual approval workflow for comments

## Technology Notes

### Node.js Requirements
- Requires Node.js 18+ for crypto.hash function
- Use SQLite locally, PostgreSQL in production
- Strapi v5 tries PostgreSQL by default - configure database.js for SQLite

### Modern Features (2025)
- Nuxt 4: New app/ directory structure, improved TypeScript
- Tailwind v4: Zero-config, 5x faster builds, automatic content detection
- Strapi v5: Enhanced Content-Type Builder, improved performance

## Deployment Strategy
- Backend: Railway with PostgreSQL (~£6-8/month)
- Frontend: Vercel/Netlify (free tier)
- Images: Cloudinary CDN (free tier: 25GB)
- Total cost: £6-8/month

## User Roles & Workflow
- **Artist (Daughter)**: Creates artwork content, views comments
- **Moderator (Father)**: Approves comments, manages contact messages
- **Visitors**: Browse gallery, comment (moderated), send contact messages