"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { securityContent } from "@/components/resources/content/securityContent";

export default function SecurityPage() {
    return (
        <ResourcePage
            eyebrow="RESOURCES"
            title="Security"
            lede="Your money, your assets, and your data are held to the highest standard of protection."
            lastUpdated="Last updated · June 5, 2026"
            content={securityContent}
        />
    );
}
