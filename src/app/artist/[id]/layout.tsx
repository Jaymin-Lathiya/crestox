import { Metadata } from "next";
import { interpolateTemplate } from "@/utils/getPageMetadata";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://crestox-backend-production-6031.up.railway.app/api";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    // Fetch entity data and DB template in parallel
    const [artistRes, templateRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/artists/${id}/basic`, { next: { revalidate: 3600 } }),
        fetch(`${BASE_URL}/seo/metadata?path=${encodeURIComponent("/artist/[id]")}`, {
            next: { revalidate: 3600 },
        }),
    ]);

    // Parse artist entity
    let artist: Record<string, string | number | null> = {};
    if (artistRes.status === "fulfilled" && artistRes.value.ok) {
        const json = await artistRes.value.json();
        artist = json?.data ?? json ?? {};
    }

    const artistName = String(artist?.artist_name ?? "Artist");
    const bio = artist?.bio ? String(artist.bio) : null;
    const avatar = artist?.avatar_url ? String(artist.avatar_url) : null;

    // Build variable map for template interpolation
    const vars: Record<string, string> = {
        artist_name: artistName,
        bio: bio ?? "",
        location: artist?.location ? String(artist.location) : "",
        university_name: artist?.university_name ? String(artist.university_name) : "",
        total_fractals: String(artist?.total_fractals ?? ""),
        available_fractals: String(artist?.available_fractals ?? ""),
        current_share_value: String(artist?.current_share_value ?? ""),
    };

    // Derive title and description: use DB template if available, else fall back
    let title = `${artistName} | Crestox`;
    let description = bio ?? `Discover ${artistName}'s fractional art collection on Crestox.`;
    let ogImageAlt: string | null = null;

    if (templateRes.status === "fulfilled" && templateRes.value.ok) {
        const tmpl = await templateRes.value.json();
        if (tmpl?.title) title = interpolateTemplate(tmpl.title, vars);
        if (tmpl?.description) description = interpolateTemplate(tmpl.description, vars);
        if (tmpl?.og_image_alt) ogImageAlt = interpolateTemplate(tmpl.og_image_alt, vars);
    }

    const metadata: Metadata = { title, description };

    if (avatar) {
        const ogImage = ogImageAlt ? { url: avatar, alt: ogImageAlt } : { url: avatar };
        metadata.openGraph = { title, description, images: [ogImage] };
        metadata.twitter = { card: "summary_large_image", title, description, images: [avatar] };
    }

    return metadata;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
