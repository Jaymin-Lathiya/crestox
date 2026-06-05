"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { communityContent } from "@/components/resources/content/communityContent";

export default function CommunityPage() {
    return (
        <ResourcePage
            eyebrow="RESOURCES"
            title="Community"
            lede="Art has always been a collective act. Crestox is where that collective finds its home."
            lastUpdated="Last updated · June 5, 2026"
            content={communityContent}
        />
    );
}
