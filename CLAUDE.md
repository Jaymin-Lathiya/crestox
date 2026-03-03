# Crestox — Project Context for Claude Code

## Project Overview
**Crestox** is a fractional art investment platform — users can buy/sell "shards" (fractional ownership) of artworks. Built with Next.js App Router, deployed on Netlify.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.5 (App Router) |
| Language | TypeScript 5.8.3 |
| UI | React 18.2.0 + shadcn/ui (Radix UI) |
| Styling | Tailwind CSS 3.4.17 |
| State | Zustand 4.5.7 |
| Data Fetching | Axios 1.13.5 + React Query 5.83.0 |
| Forms | react-hook-form 7.61.1 + Zod 3.25.76 |
| 3D | Three.js 0.160.1 + React Three Fiber 8.18.0 |
| Animation | Framer Motion 12.34.0, GSAP 3.14.2, Lenis 1.3.17 |
| Auth | Custom Magic Link (no NextAuth) |
| Icons | lucide-react 0.462.0 |
| Notifications | Sonner 1.7.4 |
| Theme | next-themes 0.3.0 |
| Deployment | Netlify (@netlify/plugin-nextjs) |

---

## Directory Structure

```
src/
├── apis/
│   ├── auth/
│   │   ├── authActions.ts      # getMagicLink, verifyMagicLink, getToken
│   │   └── authUrls.ts         # API endpoint constants
│   └── user/
│       ├── userActions.ts      # getProfile action
│       └── userUrls.ts         # User endpoints
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (Header + Footer)
│   ├── auth/verify/page.tsx    # Magic link token verification
│   ├── login/page.tsx          # Login with magic link
│   ├── signup/page.tsx         # Signup (2-step: name + email)
│   ├── forgot-password/        # Password recovery
│   ├── explore/page.tsx        # Browse artworks
│   ├── app/page.tsx            # Main marketplace (3D canvas)
│   ├── portfolio/page.tsx      # User holdings
│   ├── collection/page.tsx     # Collection view
│   ├── art/page.tsx            # Art detail
│   ├── artist/page.tsx         # Artist profile
│   └── about-us/page.tsx       # About page
├── components/
│   ├── ui/                     # shadcn/ui + custom UI primitives
│   ├── layout/
│   │   ├── Header.tsx          # Nav with dock menu, theme toggle, auth state
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── NoiseOverlay.tsx
│   ├── home/                   # Landing page sections
│   ├── canvas/                 # 3D canvas components (Three.js)
│   ├── hud/                    # HUD overlays
│   ├── explore/, dashboard/, collection/, artist/, about/
│   ├── patterns/, reui/, kokonutui/, motion-primitives/
│   └── Providers.tsx           # React context providers wrapper
├── store/
│   ├── useUserStore.ts         # User profile state
│   ├── useAuthStore.ts         # Auth flow state (magic links, tokens)
│   └── useAppStore.ts          # App-wide state (artworks, holdings, listings)
├── utils/
│   ├── apiCalls.ts             # Axios instance with auth interceptors
│   ├── cookieUtils.ts          # Cookie management (SSR-safe)
│   └── strings.ts              # Env-based constants
├── hooks/                      # Custom React hooks
├── config/staticData.ts        # Static config data
└── views/
    ├── LandingPage.tsx         # Main landing page view
    ├── AppPage.tsx             # 3D marketplace view
    └── NotFound.tsx
```

---

## Authentication Flow (Magic Link)

1. User enters email on `/login` or `/signup`
2. `useAuthStore.requestMagicLink(email, name?)` → POST `/auth/magic-link/request`
3. Server sends email with token link → user clicks → lands on `/auth/verify?token=...`
4. `useAuthStore.verifyMagicLinkToken(token)` → GET `/auth/magic-link/verify?token=...`
5. Access token saved via `setCookie("token", accessToken, 30)` (30-day expiry)
6. Token injected in all subsequent requests via Axios interceptor (`Authorization: Bearer <token>`)
7. On app load, Header checks `getCookie("token")` → calls `useUserStore.fetchProfile()` if present

### Key Auth Files
- `src/apis/auth/authActions.ts` — curried async action functions
- `src/store/useAuthStore.ts` — auth state + methods
- `src/store/useUserStore.ts` — user profile state + fetchProfile
- `src/utils/apiCalls.ts` — Axios instance with interceptors
- `src/utils/cookieUtils.ts` — SSR-safe cookie helpers

---

## API Integration Pattern

```typescript
// Action (curried async function)
export const getMagicLink = (data: any) => async () => {
    const response = await instance.post(AUTH_URLS.MAGIC_LINK_REQUEST, data);
    return response;
}
// Called in store as: await getMagicLink(data)()
```

- Base URL: `NEXT_PUBLIC_BASE_URL` environment variable
- All endpoints defined in `*Urls.ts` files
- Error messages: `err?.response?.data?.message`
- Toasts via Sonner for user feedback

---

## State Management (Zustand)

- `useUserStore` — `user`, `isLoading`, `error`, `fetchProfile()`, `clearUser()`
- `useAuthStore` — `email`, `isLoading`, `error`, `isSuccess`, `requestMagicLink()`, `verifyMagicLinkToken()`, `clearStore()`
- `useAppStore` — `currentView`, `selectedArtwork`, `artworks`, `holdings`, `listings`, `watchlist`

---

## Styling Conventions

- Tailwind utility-first; custom colors: `lime`, `red`, `lavender`, `obsidian`, `graphite`, `gold`, `cyber`
- Custom animations: `pulse-glow`, `float`, `fade-in-up`, `slide-in-right`
- Dark/light mode via `next-themes`
- All components use `"use client"` where needed
- 3D components use dynamic import with `{ ssr: false }`

---

## Important Notes

- **SSR Safety**: Always guard `document`/`window` access (check `typeof document !== "undefined"`)
- **Fonts**: GT Alpina (serif), Aeonik Mono (mono), Inter (sans-serif)
- **Current Branch**: `feature/redirection`
- **Recently Modified**: `src/components/layout/Header.tsx`
- **Project origin**: Generated via Lovable.dev, then customized
- **No NextAuth**: Auth is custom cookie + magic link based
