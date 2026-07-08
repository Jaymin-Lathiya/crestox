import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/crea-ai");
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
