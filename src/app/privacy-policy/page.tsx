"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { privacyPolicyContent } from "@/components/resources/content/privacyPolicyContent";

export default function PrivacyPolicyPage() {
    return (
        <ResourcePage
            eyebrow="LEGAL FRAMEWORK"
            title="Privacy"
            titleEm="Policy"
            lede="What information we collect, how we use it, who we share it with, and your rights."
            lastUpdated="Last updated · June 8, 2026"
            content={privacyPolicyContent}
        />
    );
}
