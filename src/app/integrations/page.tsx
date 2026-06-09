"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { integrationsContent } from "@/components/resources/content/integrationsContent";

export default function IntegrationsPage() {
    return (
        <ResourcePage
            eyebrow="PRODUCT"
            title="Integrations"
            lede="The third-party infrastructure behind Crestox — what we connect with, what data is shared, and why."
            lastUpdated="Last updated · June 8, 2026"
            content={integrationsContent}
        />
    );
}
