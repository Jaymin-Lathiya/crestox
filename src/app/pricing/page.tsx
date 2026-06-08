"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { pricingContent } from "@/components/resources/content/pricingContent";

export default function PricingPage() {
    return (
        <ResourcePage
            eyebrow="PRODUCT"
            title="Pricing"
            lede="Clearly disclosed fees on every transaction — no hidden charges, no subscription to access the marketplace."
            lastUpdated="Last updated · June 8, 2026"
            content={pricingContent}
        />
    );
}
