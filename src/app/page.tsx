import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";
import LandingPage from "@/views/LandingPage";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/");
}

export default function Home() {
    return <LandingPage />;
}
