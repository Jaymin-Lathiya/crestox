import { Metadata } from "next";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://crestox-backend-production-6031.up.railway.app/api";

const DEFAULT_METADATA: Metadata = {
    title: "Crestox",
    description: "Crestox - Fractional Art Ownership",
};

/**
 * Fetches SEO metadata for a static page path from the backend.
 * Uses Next.js ISR-style fetch caching (revalidates every hour).
 */
export async function getPageMetadata(path: string): Promise<Metadata> {
    try {
        const res = await fetch(
            `${BASE_URL}/seo/metadata?path=${encodeURIComponent(path)}`,
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) return DEFAULT_METADATA;

        const json = await res.json();
        const data = json?.data ?? json;

        const metadata: Metadata = {
            title: data.title || DEFAULT_METADATA.title,
            description: data.description || DEFAULT_METADATA.description,
        };

        if (data.og_image) {
            const ogImage = data.og_image_alt
                ? { url: data.og_image, alt: data.og_image_alt }
                : { url: data.og_image };
            metadata.openGraph = {
                title: data.title,
                description: data.description,
                images: [ogImage],
            };
            metadata.twitter = {
                card: "summary_large_image",
                title: data.title,
                description: data.description,
                images: [data.og_image],
            };
        }

        return metadata;
    } catch {
        return DEFAULT_METADATA;
    }
}

/**
 * Interpolates {variable} placeholders in a template string with actual values.
 * Unresolved variables are left as-is (e.g., {unknown} stays {unknown}).
 */
export function interpolateTemplate(
    template: string,
    vars: Record<string, string>
): string {
    return template.replace(/\{([^}]+)\}/g, (_, key) => vars[key] ?? "");
}
