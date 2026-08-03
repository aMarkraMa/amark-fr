# Personal Site Starter

A monorepo for a personal portfolio site with an optional AI chat assistant (RAG).

| Package | Stack |
|---------|--------|
| `frontend/` | Vite, React 19, TypeScript, Tailwind CSS, React Router |
| `services/chat-api/` | FastAPI, OpenAI embeddings, ChromaDB |

Live example: [amark.fr](https://amark.fr)

---

## Prerequisites

- **Node.js** 20+ and [pnpm](https://pnpm.io)
- **Python** 3.12 and [uv](https://github.com/astral-sh/uv) (chat API only)
- An **OpenAI API key** if you want the chat / RAG features

---

## Quick start

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### Frontend only

```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). The site runs without the backend; Chat will fail until the API is up.

### Chat API (optional)

```bash
cd services/chat-api
cp .env.exemple .env.local   # then fill in your keys
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

In development, Vite proxies `/api` to `http://127.0.0.1:8000`. Override with:

```bash
VITE_API_PROXY_TARGET=http://127.0.0.1:8000 pnpm dev
```

### Docker Compose (optional)

From the repo root (requires `services/chat-api/.env.local`):

```bash
docker compose up --build
```

- Frontend: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:8000`

---

## Make it your site

After cloning, replace the sample content with yours. Posts and projects are Markdown files loaded automatically via `import.meta.glob` — no manual registry for each file.

### 1. Profile & home page

| What | Where |
|------|--------|
| Name, bio, contact, avatar | `frontend/src/pages/Home/data/user.ts` |
| Work experience | `frontend/src/pages/Home/data/experience.ts` |
| Social links | `frontend/src/pages/Home/data/social-links.ts` |
| Avatar & cover images | `frontend/public/assets/profile/` |
| Company logos | `frontend/public/assets/company-logos/` |

### 2. Navigation & site metadata

Edit `frontend/src/config/site.ts` (nav items, UTM source / domain branding).

### 3. Blog posts

1. Add a Markdown file under `frontend/src/features/blog/content/` (filename = URL slug).
2. Put cover images under `frontend/public/assets/blog/<slug>/`.
3. Use frontmatter like:

```md
---
title: My post title
description: Short summary for the list and SEO.
image: /assets/blog/my-post/cover.webp
createdAt: 2026-01-15
updatedAt: 2026-01-15
pinned: false
---

Your content here…
```

Delete or replace the existing sample posts.

### 4. Projects

Same pattern as blog:

- Content: `frontend/src/features/project/content/*.md`
- Assets: `frontend/public/assets/project/<slug>/`

Optional frontmatter fields: `link` (external / demo URL), `pinned: true`.

### 5. Chat persona & knowledge base

Only needed if you keep the Chat page.

1. **API keys** — in `services/chat-api/.env.local`:

   ```env
   OPENAI_API_KEY="sk-..."
   GEMINI_API_KEY="..."   # optional, depending on your setup
   ```

2. **Persona / system prompt** — edit `SYSTEM_INSTRUCTION` (and model names if needed) in `services/chat-api/app/config.py`.

3. **Documents for RAG** — put `.md`, `.txt`, or `.pdf` files in `services/chat-api/app/rag/data/`. Remove the sample profile docs.

4. **Build the vector index** (from `services/chat-api`, with `OPENAI_API_KEY` set):

   ```bash
   uv run python app/rag/indexer.py
   ```

   Default Chroma path: `./app/rag/data/.chroma` (override with `CHROMA_PATH`). Full rebuild:

   ```bash
   rm -rf app/rag/data/.chroma
   uv run python app/rag/indexer.py
   ```

### 6. Deployment hooks

If you deploy the frontend on Vercel (or similar), update `frontend/vercel.json`:

- Host redirects for your domain
- `/api` rewrite to your hosted chat API (e.g. Railway)
- Any demo / project rewrites you no longer need

---

## Scripts

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |

### Chat API (`services/chat-api/`)

| Command | Description |
|---------|-------------|
| `uv sync` | Install Python dependencies |
| `uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` | Dev server |
| `uv run python app/rag/indexer.py` | Build / refresh Chroma index |

---

## Project layout

```text
.
├── frontend/                 # Vite + React SPA
│   ├── public/assets/        # Images, icons, static demos
│   └── src/
│       ├── config/           # Nav & site config
│       ├── features/blog/    # Blog Markdown + UI
│       ├── features/project/ # Project Markdown + UI
│       └── pages/            # Home, Chat, Blog, Project
└── services/
    └── chat-api/             # FastAPI + RAG
        └── app/rag/data/     # Source docs for the indexer
```

---

## License

Use and adapt freely for your own personal site. Replace all personal data, assets, and API keys before publishing.
