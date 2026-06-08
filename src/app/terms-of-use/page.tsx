"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { termsOfUseContent } from "@/components/resources/content/termsOfUseContent";

export default function TermsOfUsePage() {
    return (
        <ResourcePage
            eyebrow="LEGAL FRAMEWORK"
            title="Terms of"
            titleEm="Use"
            lede="The agreement governing your access to and use of the Crestox platform."
            lastUpdated="Last updated · June 8, 2026"
            content={termsOfUseContent}
        />
    );
}
