import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";
import AppPage from "@/views/AppPage";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/app");
}

export default function Page() {
    return <AppPage />;
}
// return <ExploreGrid />;
// 