"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { docsContent } from "@/components/resources/content/docsContent";

export default function DocsPage() {
    return (
        <ResourcePage
            eyebrow="RESOURCES"
            title="Documentation"
            lede="Everything you need to understand how Crestox works — before you invest, list, or participate."
            lastUpdated="Last updated · June 5, 2026"
            content={docsContent}
        />
    );
}
