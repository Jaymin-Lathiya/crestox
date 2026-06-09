"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { riskDisclosureContent } from "@/components/resources/content/riskDisclosureContent";

export default function RiskDisclosurePage() {
    return (
        <ResourcePage
            eyebrow="LEGAL FRAMEWORK"
            title="Risk"
            titleEm="Disclosure"
            lede="The nature and extent of the risks associated with participating on the Crestox platform."
            lastUpdated="Last updated · June 8, 2026"
            content={riskDisclosureContent}
        />
    );
}
