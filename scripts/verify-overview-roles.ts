/**
 * Verification harness for the role-aware portfolio Overview tab.
 *
 * It constructs a user of every kind (matching the real /profile response shape,
 * including the plural `curators` role slug the backend actually seeds) and
 * asserts which Overview experience the dispatcher would render for each:
 *
 *   artist  -> ArtistOverview
 *   curator -> CuratorOverview
 *   owner   -> OwnerOverview
 *   none    -> BecomeCreatorOverview (collector / skipped selection)
 *
 * Run with:  npx tsx scripts/verify-overview-roles.ts
 */
import { getPrimaryCreatorRole, getRoleSlugs } from "../src/utils/userRoles";

type OverviewDestination =
  | "ArtistOverview"
  | "CuratorOverview"
  | "OwnerOverview"
  | "BecomeCreatorOverview";

/** Mirrors the branch logic in OverviewTab.tsx. */
function overviewDestination(user: unknown): OverviewDestination {
  const role = getPrimaryCreatorRole(user as never);
  if (role === "artist") return "ArtistOverview";
  if (role === "curator") return "CuratorOverview";
  if (role === "owner") return "OwnerOverview";
  return "BecomeCreatorOverview";
}

/** A role object exactly as the backend profile endpoint returns it. */
function role(slug: string, name: string) {
  return { roleId: 1, roleName: name, roleSlug: slug, roleType: "user" };
}

type Case = {
  label: string;
  user: unknown;
  expected: OverviewDestination;
};

const cases: Case[] = [
  // ── Primary signup outcomes ──────────────────────────────────────────────
  {
    label: "Collector (signed up as collector)",
    user: { roles: [role("collector", "Collector")] },
    expected: "BecomeCreatorOverview",
  },
  {
    label: "Skipped role selection (collector only)",
    user: { roles: [role("collector", "Collector")] },
    expected: "BecomeCreatorOverview",
  },
  {
    label: "Artist (collector + artist)",
    user: { roles: [role("collector", "Collector"), role("artist", "Artist")] },
    expected: "ArtistOverview",
  },
  {
    // The backend seeds the curator role with the PLURAL slug `curators`.
    label: "Curator (collector + curators [plural slug])",
    user: { roles: [role("collector", "Collector"), role("curators", "Curator")] },
    expected: "CuratorOverview",
  },
  {
    label: "Owner (collector + owner)",
    user: { roles: [role("collector", "Collector"), role("owner", "Owner")] },
    expected: "OwnerOverview",
  },

  // ── Edge cases ───────────────────────────────────────────────────────────
  {
    label: "Curator via singular `curator` slug (defensive)",
    user: { roles: [role("collector", "Collector"), role("curator", "Curator")] },
    expected: "CuratorOverview",
  },
  {
    label: "Multi-role user: artist beats curator/owner (priority order)",
    user: {
      roles: [role("curators", "Curator"), role("owner", "Owner"), role("artist", "Artist")],
    },
    expected: "ArtistOverview",
  },
  {
    label: "Multi-role user: curator beats owner",
    user: { roles: [role("owner", "Owner"), role("curators", "Curator")] },
    expected: "CuratorOverview",
  },
  {
    label: "Legacy string[] roles shape",
    user: { roles: ["collector", "owner"] },
    expected: "OwnerOverview",
  },
  {
    label: "Roles with only a name (no slug) – falls back to roleName",
    user: { roles: [{ roleId: 1, roleName: "artist", roleType: "user" }] },
    expected: "ArtistOverview",
  },
  {
    label: "Mixed case slug",
    user: { roles: [role("Owner", "Owner")] },
    expected: "OwnerOverview",
  },
  {
    label: "Empty roles array",
    user: { roles: [] },
    expected: "BecomeCreatorOverview",
  },
  {
    label: "Missing roles field",
    user: {},
    expected: "BecomeCreatorOverview",
  },
  {
    label: "null user",
    user: null,
    expected: "BecomeCreatorOverview",
  },
];

let passed = 0;
let failed = 0;
const rows: Array<Record<string, string>> = [];

for (const c of cases) {
  const actual = overviewDestination(c.user);
  const ok = actual === c.expected;
  ok ? passed++ : failed++;
  rows.push({
    Result: ok ? "PASS" : "FAIL",
    User: c.label,
    Slugs: `[${getRoleSlugs(c.user as never).join(", ")}]`,
    Renders: actual,
    Expected: c.expected,
  });
}

console.table(rows);
console.log(`\n${passed} passed, ${failed} failed, ${cases.length} total.`);

if (failed > 0) {
  process.exitCode = 1;
}
