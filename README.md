# SnapNest

### Scalable Advanced Software Solutions — Coursework

---

SnapNest is a photo and video sharing community built around two audiences: **creators** who want to publish and manage their visual content, and **consumers** who want to discover, engage with, and save that content. The architecture treats scalability as a first-class constraint — not an afterthought.

---

## User Roles and What They Can Do

### Creators
- Create an account and log in
- Upload photos or videos with metadata: title, caption, location, tagged people
- View a private dashboard of their own uploads
- Delete any of their own posts

### Consumers
- Create an account and log in
- Browse a paginated feed of all published content
- Search across title, caption, location, and people fields
- Open individual posts to see full detail and metadata
- Rate posts from 1 to 5 stars (one rating per post, resubmission updates the existing rating)
- Leave comments on any post
- Bookmark posts to a personal saved collection
- Follow and unfollow creators

---

## Technical Stack

**Frontend**
- React 18 with Vite (fast development server and optimised production builds)
- Tailwind CSS for styling
- React Router v6 for client-side navigation
- Axios for API calls with automatic JWT attachment

**Backend**
- Node.js with Express.js (lightweight REST API framework)
- Prisma ORM connected to PostgreSQL
- JWT (jsonwebtoken) for stateless authentication
- bcryptjs for secure password hashing
- Multer for handling multipart file uploads

**Testing**
- Jest as the test runner
- Supertest for HTTP-level integration testing against the live Express app

---

## How the System Fits Together

```
┌────────────────────────────────────────────┐
│                 CLIENT TIER                │
│                                            │
│   React 18 Single-Page Application         │
│   Built with Vite → outputs static files  │
│   Runs entirely in the browser             │
└─────────────────────┬──────────────────────┘
                      │
                      │  HTTPS   /api/*
                      │
┌─────────────────────▼──────────────────────┐
│                 SERVICE TIER               │
│                                            │
│   Express.js REST API                      │
│   ├── JWT auth middleware                  │
│   ├── Role-check middleware                │
│   ├── In-memory cache (60s TTL)            │
│   └── Multer file handler                  │
└──────────────┬─────────────────┬───────────┘
               │                 │
   ┌───────────▼──────┐   ┌──────▼────────────┐
   │   DATA TIER      │   │  STORAGE TIER      │
   │                  │   │                    │
   │  PostgreSQL DB   │   │  uploads/ folder   │
   │  via Prisma ORM  │   │  (filesystem or    │
   │                  │   │   object store)    │
   └──────────────────┘   └────────────────────┘
```

---

## Scalability by Design

**Stateless authentication**
JWT tokens contain a signed payload with user ID and role. The server validates the signature on each request — no session table, no sticky sessions, no shared memory between API instances. Add more instances behind a load balancer and they all work immediately.

**Storage separation**
Media files are stored in `backend/uploads/` and the database records only the file path. This separation means the database stays small and fast. When needed, `uploads/` can be replaced with OpenStack Swift, Cloudflare R2, or any S3-compatible object store by swapping the Multer storage configuration only.

**Response caching**
The feed listing and search results are wrapped in a 60-second in-memory cache. Repeated reads of the same page hit memory rather than the database. The cache is invalidated when a new image is uploaded. For multi-instance deployments, Redis replaces the in-memory store with no application-level changes.

**SPA frontend**
The React application compiles to static HTML, CSS, and JS files. These can be served from Nginx, uploaded to Netlify or Vercel, or deployed to any CDN. Zero server-side rendering required.

**Managed database compatibility**
Prisma works with any PostgreSQL host. Free-tier services like Neon or Supabase are sufficient for coursework; the same schema and migrations run unchanged on managed production clusters.

---

## Database Tables

```
users
  id            SERIAL PRIMARY KEY
  name          VARCHAR
  email         VARCHAR UNIQUE
  password_hash VARCHAR
  role          ENUM('creator', 'consumer')
  created_at    TIMESTAMPTZ
  updated_at    TIMESTAMPTZ

images
  id              SERIAL PRIMARY KEY
  creator_id      INT → users.id
  title           VARCHAR
  caption         TEXT (optional)
  location        VARCHAR (optional)
  people_present  TEXT (optional)
  image_url       VARCHAR
  storage_key     VARCHAR
  created_at      TIMESTAMPTZ

comments
  id            SERIAL PRIMARY KEY
  image_id      INT → images.id
  user_id       INT → users.id
  comment_text  TEXT
  created_at    TIMESTAMPTZ

ratings
  id            SERIAL PRIMARY KEY
  image_id      INT → images.id
  user_id       INT → users.id
  rating_value  INT CHECK (1 <= rating_value <= 5)
  UNIQUE(image_id, user_id)

bookmarks
  id        SERIAL PRIMARY KEY
  image_id  INT → images.id
  user_id   INT → users.id

follows
  id           SERIAL PRIMARY KEY
  follower_id  INT → users.id
  following_id INT → users.id
```

---

## API Reference

| Method | Endpoint | Auth | Role | What it does |
|--------|----------|------|------|--------------|
| POST | `/api/auth/register` | — | — | Register a new consumer |
| POST | `/api/auth/login` | — | — | Log in, receive a JWT |
| GET | `/api/auth/me` | Required | Any | Return the current user |
| POST | `/api/images` | Required | Creator | Publish new media |
| GET | `/api/images` | — | — | Paginated feed (cached) |
| GET | `/api/images/search?q=` | — | — | Search posts (cached) |
| GET | `/api/images/mine` | Required | Creator | Creator's uploads |
| GET | `/api/images/:id` | — | — | Single post detail |
| DELETE | `/api/images/:id` | Required | Creator | Delete own post |
| POST | `/api/images/:id/comments` | Required | Consumer | Add a comment |
| POST | `/api/images/:id/ratings` | Required | Consumer | Rate or update rating |
| POST | `/api/images/:id/likes` | Required | Consumer | Toggle like |
| POST | `/api/images/:id/bookmarks` | Required | Consumer | Toggle bookmark |
| POST | `/api/users/:id/follow` | Required | Consumer | Toggle follow |

---

## Getting Started

You need Node.js 18 or later and a running PostgreSQL 14 instance.

**Step 1 — Backend**

```bash
cd backend
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to your PostgreSQL connection string, for example:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/snapnest
```

Then install and initialise:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

The API starts on `http://localhost:5000`.

**Step 2 — Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app opens on `http://localhost:5173`.

---

## Running the Test Suite

```bash
cd backend
npm test
```

The tests spin up a real HTTP server against your test database. All eight scenarios must pass:

1. A consumer can register successfully
2. A creator can log in and receive a valid JWT
3. A logged-in creator can upload an image (HTTP 201)
4. A logged-in consumer cannot upload an image (HTTP 403)
5. An unauthenticated request to upload is rejected (HTTP 401)
6. A consumer can post a comment on any image
7. A consumer can rate an image (value stored in DB)
8. A search query returns relevant results

Set `DATABASE_URL` in `backend/.env.test` before running.

---

## Deploying

**Environment variables needed in production**

```
DATABASE_URL=postgresql://user:pass@host:5432/snapnest
JWT_SECRET=a-secret-with-at-least-32-characters
PORT=5000
CLIENT_URL=https://your-frontend-url.com
```

**Launch the API**

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
node server.js
```

**Build the frontend**

```bash
cd frontend
npm install
npm run build
# serve the dist/ directory
```

**Nginx configuration**

```nginx
server {
    listen 80;

    location /api      { proxy_pass http://localhost:5000; }
    location /uploads  { proxy_pass http://localhost:5000; }

    location / {
        root /var/www/snapnest/dist;
        try_files $uri /index.html;
    }
}
```

**Suggested free hosting providers**

- Database: [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- API: [Railway](https://railway.app) or [Render](https://render.com)
- Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Creator | creator@example.com | password123 |
| Consumer | consumer@example.com | password123 |

---

## Current Limitations

- **In-memory cache** — shared state within one process only. Multi-instance deployments need Redis.
- **Local uploads** — files live at `backend/uploads/`. Containerised redeployments will lose files. Use object storage in production.
- **No email verification** — accounts are active immediately upon registration.
- **No media transcoding** — videos are served as uploaded; no format normalisation or compression.
- **No admin panel** — content moderation would require direct database access.

---

## References

| Tool | Documentation |
|------|--------------|
| Express.js | https://expressjs.com |
| Prisma ORM | https://www.prisma.io/docs |
| React | https://react.dev |
| Vite | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| JSON Web Tokens | https://jwt.io |
| Multer | https://github.com/expressjs/multer |
| Jest | https://jestjs.io |
| Supertest | https://github.com/ladjs/supertest |
