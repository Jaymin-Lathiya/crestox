import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";
import ArtistProfileForm from "@/app/signup/ArtistProfileForm";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/onboarding/artist");
}

export default function ArtistOnboardingPage() {
    return <ArtistProfileForm />
}
