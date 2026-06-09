"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { secondaryMarketplaceTermsContent } from "@/components/resources/content/secondaryMarketplaceTermsContent";

export default function SecondaryMarketplaceTermsPage() {
    return (
        <ResourcePage
            eyebrow="LEGAL FRAMEWORK"
            title="Secondary Marketplace"
            titleEm="Terms"
            lede="The terms governing the resale of Fractals between Collectors on the Crestox Secondary Marketplace."
            lastUpdated="Last updated · June 8, 2026"
            content={secondaryMarketplaceTermsContent}
        />
    );
}
