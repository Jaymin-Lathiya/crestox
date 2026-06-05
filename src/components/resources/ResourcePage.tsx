"use client";

import Link from "next/link";

interface ResourcePageProps {
  /** Small uppercase label above the title */
  eyebrow?: string;
  /** Main hero title */
  title: string;
  /** Optional italicised word appended to the title (styled in primary color) */
  titleEm?: string;
  /** Short supporting paragraph below the title */
  lede?: string;
  /** "Last updated" meta line */
  lastUpdated?: string;
  /** Inner HTML for the document body (rendered inside the styled content card) */
  content: string;
}

/**
 * Shared shell for the long-form resource pages (Docs, Security, Support,
 * Community). The Header and Footer are supplied by the root layout, so this
 * component only renders the hero + styled markdown content card.
 *
 * All styling is scoped under `.cx-resource-page` so it never leaks into the
 * rest of the app.
 */
export default function ResourcePage({
  eyebrow,
  title,
  titleEm,
  lede,
  lastUpdated,
  content,
}: ResourcePageProps) {
  return (
    <div className="cx-resource-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
      />

      <header className="cx-hero">
        {eyebrow && <span className="eyebrow mt-12">{eyebrow}</span>}
        <h1>
          {title}
          {titleEm && <em> {titleEm}</em>}
        </h1>
        {lede && <p className="lede">{lede}</p>}
        {lastUpdated && <div className="meta">{lastUpdated}</div>}
      </header>

      <main
        className="cx-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="cx-back">
        <Link href="/">← Back to Home</Link>
      </div>

      <style>{`
.cx-resource-page {
  /* Derived from the app's theme tokens (see globals.css) so these pages
     follow the global dark / light toggle automatically. */
  --c-surface: hsl(var(--card));
  --c-border: hsl(var(--border));
  --c-text: hsl(var(--foreground));
  --c-text-sub: hsl(var(--muted-foreground));
  --c-heading: hsl(var(--text-heading));
  --c-primary: hsl(var(--color-primary-accent));
  --c-primary-soft: hsl(var(--color-primary-accent) / 0.14);
  --c-primary-hover: hsl(221 83% 45%);
  --c-tint: hsl(var(--color-primary-accent) / 0.06);
  --radius: 0.75rem;
  --radius-lg: 1rem;
  /* Match the header's container: max-w-7xl (80rem) with 1rem side margins. */
  --container: 80rem;
  --container-w: calc(100% - 2rem);
  --gutter: clamp(1rem, 4vw, 3.5rem);

  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--c-text);
  background: radial-gradient(ellipse at top, hsl(var(--bg-canvas)) 0%, hsl(var(--bg-sidebar)) 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.7;
  min-height: 100vh;
  scroll-behavior: smooth;
}
.dark .cx-resource-page {
  --c-primary-hover: hsl(221 83% 68%);
  --c-primary-soft: hsl(var(--color-primary-accent) / 0.22);
}
.cx-resource-page *,
.cx-resource-page *::before,
.cx-resource-page *::after { box-sizing: border-box; }

/* HERO */
.cx-resource-page .cx-hero { text-align: center; padding: 5rem var(--gutter) 3rem; width: var(--container-w); max-width: var(--container); margin: 0 auto; }
.cx-resource-page .cx-hero .eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--c-primary-soft); color: var(--c-primary);
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  padding: 0.5rem 1rem; border-radius: 999px;
  margin-bottom: 1.5rem;
}
.cx-resource-page .cx-hero .eyebrow::before {
  content: ''; width: 6px; height: 6px; border-radius: 999px; background: var(--c-primary);
}
.cx-resource-page .cx-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 600; line-height: 1.1; color: var(--c-heading);
  letter-spacing: -0.02em;
}
.cx-resource-page .cx-hero h1 em {
  font-style: italic; color: var(--c-primary); font-weight: 500;
}
.cx-resource-page .cx-hero .lede {
  color: var(--c-text-sub); font-size: 1.05rem;
  max-width: 620px; margin: 1.25rem auto 0; line-height: 1.7;
}
.cx-resource-page .cx-hero .meta {
  font-family: 'Space Mono', monospace; font-size: 0.7rem;
  color: var(--c-text-sub); letter-spacing: 0.15em; text-transform: uppercase;
  margin-top: 1.5rem;
}

/* CONTENT */
.cx-resource-page .cx-content {
  width: var(--container-w); max-width: var(--container); margin: 0 auto 3rem;
  padding: 1.5rem var(--gutter) 4rem;
  background: var(--c-surface);
  border-radius: 1rem;
  border: 1px solid var(--c-border);
  box-shadow: 0 12px 40px rgba(15,23,42,0.05);
}
@media (min-width: 768px) {
  .cx-resource-page .cx-content { padding: 3rem var(--gutter) 4rem; }
}

.cx-resource-page .cx-content h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.25rem; font-weight: 600; color: var(--c-heading);
  letter-spacing: -0.02em; line-height: 1.2;
  margin: 2.5rem 0 1rem;
}
.cx-resource-page .cx-content h1:first-child { margin-top: 0; }
.cx-resource-page .cx-content h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.6rem; font-weight: 600; color: var(--c-heading);
  letter-spacing: -0.015em; line-height: 1.3;
  margin: 2.75rem 0 0.85rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--c-border);
}
.cx-resource-page .cx-content h2:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
.cx-resource-page .cx-content h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem; font-weight: 600; color: var(--c-heading);
  margin: 2rem 0 0.6rem; letter-spacing: -0.01em;
}
.cx-resource-page .cx-content h4 {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; font-weight: 700; color: var(--c-heading);
  margin: 1.5rem 0 0.5rem; text-transform: none;
}
.cx-resource-page .cx-content h5, .cx-resource-page .cx-content h6 {
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem; font-weight: 700; color: var(--c-primary);
  letter-spacing: 0.15em; text-transform: uppercase;
  margin: 1.5rem 0 0.5rem;
}

.cx-resource-page .cx-content p {
  font-size: 1rem; line-height: 1.75; color: var(--c-text);
  margin: 0 0 1.15rem;
}
.cx-resource-page .cx-content p:has(+ h2), .cx-resource-page .cx-content p:has(+ h3) { margin-bottom: 1.5rem; }

.cx-resource-page .cx-content strong { color: var(--c-heading); font-weight: 700; }
.cx-resource-page .cx-content em { font-style: italic; }

.cx-resource-page .cx-content a {
  color: var(--c-primary); text-decoration: none;
  border-bottom: 1px solid rgba(37,99,235,0.3);
  transition: border-color 0.15s, color 0.15s;
}
.cx-resource-page .cx-content a:hover { color: var(--c-primary-hover); border-bottom-color: var(--c-primary); }

.cx-resource-page .cx-content ul, .cx-resource-page .cx-content ol {
  margin: 0 0 1.25rem; padding-left: 1.5rem;
}
.cx-resource-page .cx-content ul li, .cx-resource-page .cx-content ol li {
  margin-bottom: 0.5rem; line-height: 1.7; padding-left: 0.25rem;
}
.cx-resource-page .cx-content ul { list-style: none; padding-left: 0; }
.cx-resource-page .cx-content ul li {
  position: relative; padding-left: 1.5rem;
}
.cx-resource-page .cx-content ul li::before {
  content: ''; position: absolute; left: 0; top: 0.7em;
  width: 6px; height: 6px; border-radius: 999px;
  background: var(--c-primary);
}
.cx-resource-page .cx-content ol { list-style: none; counter-reset: cx-counter; padding-left: 0; }
.cx-resource-page .cx-content ol li {
  position: relative; padding-left: 2.25rem; counter-increment: cx-counter;
}
.cx-resource-page .cx-content ol li::before {
  content: counter(cx-counter, decimal-leading-zero);
  position: absolute; left: 0; top: 0.1em;
  font-family: 'Space Mono', monospace; font-size: 0.75rem;
  color: var(--c-primary); font-weight: 700; letter-spacing: 0.05em;
  background: var(--c-primary-soft); padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
}

.cx-resource-page .cx-content blockquote {
  margin: 1.5rem 0; padding: 1.25rem 1.5rem;
  background: var(--c-tint); border-left: 3px solid var(--c-primary);
  border-radius: 0 var(--radius) var(--radius) 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic; font-size: 1.1rem; color: var(--c-heading);
  line-height: 1.6;
}
.cx-resource-page .cx-content blockquote p { margin: 0; }

.cx-resource-page .cx-content code {
  font-family: 'Space Mono', monospace; font-size: 0.85em;
  background: var(--c-primary-soft); color: var(--c-primary);
  padding: 0.15em 0.4em; border-radius: 0.3em;
}
.cx-resource-page .cx-content pre {
  background: #0f172a; color: #e2e8f0;
  padding: 1.25rem 1.5rem; border-radius: var(--radius);
  overflow-x: auto; margin: 1.25rem 0;
  font-family: 'Space Mono', monospace; font-size: 0.85rem; line-height: 1.6;
}
.cx-resource-page .cx-content pre code { background: transparent; color: inherit; padding: 0; }

.cx-resource-page .cx-content hr {
  border: 0; height: 1px; background: var(--c-border);
  margin: 2.5rem 0;
}

.cx-resource-page .cx-content table {
  width: 100%; border-collapse: collapse; margin: 1.5rem 0;
  font-size: 0.92rem;
}
.cx-resource-page .cx-content table th, .cx-resource-page .cx-content table td {
  padding: 0.75rem 1rem; text-align: left;
  border-bottom: 1px solid var(--c-border);
}
.cx-resource-page .cx-content table th {
  background: var(--c-tint);
  font-family: 'Space Mono', monospace; font-size: 0.7rem;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--c-text-sub);
  font-weight: 700;
}
.cx-resource-page .cx-content table tr:last-child td { border-bottom: 0; }

.cx-resource-page .cx-content img {
  max-width: 100%; height: auto; border-radius: var(--radius);
  margin: 1.5rem 0; box-shadow: 0 4px 12px rgba(15,23,42,0.08);
}

.cx-resource-page .cx-content h2 .num {
  display: inline-block;
  font-family: 'Space Mono', monospace; font-size: 0.85rem;
  color: var(--c-primary); font-weight: 700; letter-spacing: 0.1em;
  background: var(--c-primary-soft);
  padding: 0.25rem 0.65rem; border-radius: 0.5rem;
  margin-right: 0.75rem; vertical-align: middle;
  transform: translateY(-2px);
}

/* Back link */
.cx-resource-page .cx-back {
  width: var(--container-w); max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter) 4rem; text-align: center;
}
.cx-resource-page .cx-back a {
  font-family: 'Space Mono', monospace; font-size: 0.8rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--c-primary); text-decoration: none;
  background: var(--c-primary-soft); padding: 0.6rem 1.25rem; border-radius: 0.6rem;
  transition: background 0.15s;
}
.cx-resource-page .cx-back a:hover { background: hsl(var(--color-primary-accent) / 0.28); }
            `}</style>
    </div>
  );
}
