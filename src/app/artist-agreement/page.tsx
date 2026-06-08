"use client";

import ResourcePage from "@/components/resources/ResourcePage";
import { artistAgreementContent } from "@/components/resources/content/artistAgreementContent";

export default function ArtistAgreementPage() {
    return (
        <ResourcePage
            eyebrow="LEGAL FRAMEWORK"
            title="Artist"
            titleEm="Agreement"
            lede="The terms governing Artists, Curators, and Owners who submit Artworks to the platform."
            lastUpdated="Last updated · June 8, 2026"
            content={artistAgreementContent}
        />
    );
}
