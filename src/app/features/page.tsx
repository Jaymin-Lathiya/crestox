"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { featuresContent } from "@/components/resources/content/featuresContent";

export default function FeaturesPage() {
    return (
        <ResourcePage
            eyebrow="PRODUCT"
            title="Features"
            lede="Everything you need to discover, invest in, and manage fractional art — in one curated platform."
            lastUpdated="Last updated · June 8, 2026"
            content={featuresContent}
        />
    );
}
