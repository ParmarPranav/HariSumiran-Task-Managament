# HariSumiran Task Management

Intelligent productivity and sprint workspace built with Next.js 15+ (App Router), Tailwind CSS, Framer Motion, and Supabase cloud persistence.

---

## Features
- **Hero Kanban Board & Calendar Matrix**: Tactile `@dnd-kit` drag-and-drop across **Not Started**, **In Progress**, and **Done**.
- **Real-Time Deadline Countdown**: Live ticker counting down days, hours, minutes, and seconds to **Sunday, October 25, 2026**.
- **Supabase Cloud Persistence**: Built with `@supabase/supabase-js` and `@supabase/ssr` with local disk (`data/db.json`) fallback ensuring zero task loss.
- **Minimalist Aesthetic**: Distraction-free, responsive layout.

---

## Environment Variables

Configure the following variables in `.env.local` or on your deployment platform (e.g. Vercel):

```env
NEXT_PUBLIC_SUPABASE_URL=https://anitddpjpuzeupegyzis.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_z42lhzCY2i8Rk3qTTHHi_g_yk0uK5Zf
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_z42lhzCY2i8Rk3qTTHHi_g_yk0uK5Zf
```

---

## Deployment on Vercel

1. Import this repository on [Vercel](https://vercel.com/new).
2. Set Framework Preset to **Next.js**.
3. Add the environment variables listed above.
4. Click **Deploy**.

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


