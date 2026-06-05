"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { supportContent } from "@/components/resources/content/supportContent";

export default function SupportPage() {
    return (
        <ResourcePage
            eyebrow="RESOURCES"
            title="Support"
            titleEm="Centre"
            lede="Need help? You're in the right place. Browse by category below or submit a ticket and our team will get back to you within the timeframes set out in our Service Level Commitments."
            lastUpdated="Last updated · June 5, 2026"
            content={supportContent}
        />
    );
}
