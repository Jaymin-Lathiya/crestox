import type { SocialMediaLink } from "@/components/ui/social-button";

/**
 * Crestox company social links (About page, etc.). Override via .env:
 * NEXT_PUBLIC_COMPANY_INSTAGRAM_URL, NEXT_PUBLIC_COMPANY_X_URL, NEXT_PUBLIC_COMPANY_LINKEDIN_URL
 */
export const companySocialMediaLinks: SocialMediaLink[] = [
  {
    platform: "instagram",
    url: process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM_URL ?? "https://www.instagram.com/crestox",
  },
  {
    platform: "twitter",
    url: process.env.NEXT_PUBLIC_COMPANY_X_URL ?? "https://x.com/crestox",
  },
  {
    platform: "linkedin",
    url: process.env.NEXT_PUBLIC_COMPANY_LINKEDIN_URL ?? "https://www.linkedin.com/company/crestox",
  },
].filter((l) => typeof l.url === "string" && l.url.startsWith("http"));
