import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/terms-of-use");
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
