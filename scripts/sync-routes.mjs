/**
 * Sync Routes Script
 *
 * Scans src/app for all page.tsx files, derives the route paths,
 * and upserts them into the backend PageMetadata table via the
 * POST /seo/sync-routes endpoint.
 *
 * Usage:
 *   node scripts/sync-routes.mjs
 *
 * Required env vars (set in .env or shell):
 *   BACKEND_URL  - Backend API base URL
 *   SYNC_ROUTES_SECRET    - Shared secret matching backend SYNC_ROUTES_SECRET
 */

import { readdirSync, statSync, readFileSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually (no dotenv dependency) ───────────────────────────────

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const envPath = join(__dirname, "../.env");

try {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
    }
} catch {
    // .env not found – rely on shell env vars
}

// ── Config ───────────────────────────────────────────────────────────────────

const BASE_URL =
    process.env.BACKEND_URL ||
    "https://crestox-backend-production-6031.up.railway.app/api";

const SYNC_SECRET = process.env.SYNC_ROUTES_SECRET;

if (!SYNC_SECRET) {
    console.error(
        "❌  SYNC_ROUTES_SECRET is not set. Add it to .env or set it as a shell env var."
    );
    process.exit(1);
}

// ── Scan pages ───────────────────────────────────────────────────────────────

const APP_DIR = join(__dirname, "../src/app");

function scanPages(dir, paths = []) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            // Skip Next.js special directories
            if (["(", "_"].some((c) => entry.startsWith(c))) continue;
            scanPages(full, paths);
        } else if (entry === "page.tsx" || entry === "page.ts" || entry === "page.jsx" || entry === "page.js") {
            const rel = relative(APP_DIR, dir);
            // Convert file-system path to route path
            const routePath = rel === "" ? "/" : "/" + rel.replace(/\\/g, "/");
            paths.push(routePath);
        }
    }
    return paths;
}

const routePaths = scanPages(APP_DIR);
console.log(`📄  Found ${routePaths.length} page routes:`);
routePaths.forEach((p) => console.log(`     ${p}`));

// ── Send to backend ──────────────────────────────────────────────────────────

console.log(`\n🚀  Syncing to ${BASE_URL}/seo/sync-routes ...`);

try {
    const response = await fetch(`${BASE_URL}/seo/sync-routes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-sync-secret": SYNC_SECRET,
        },
        body: JSON.stringify({ paths: routePaths }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`❌  Server returned ${response.status}: ${text}`);
        process.exit(1);
    }

    const result = await response.json();
    console.log(`\n✅  Sync complete:`);
    console.log(`     Created : ${result.created}`);
    console.log(`     Skipped : ${result.skipped} (already exist)`);
    console.log(`     Total   : ${result.total}`);
} catch (err) {
    console.error("❌  Failed to reach backend:", err.message);
    console.error(
        "    Make sure the backend is running and BACKEND_URL is correct."
    );
    process.exit(1);
}
