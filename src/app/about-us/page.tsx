"use client";

import TeamSection from "@/components/about/artistCard";
import SocialButton from "@/components/ui/social-button";
import { companySocialMediaLinks } from "@/config/companySocial";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <TeamSection />
        </div>
    );
}