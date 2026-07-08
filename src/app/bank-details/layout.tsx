import { Metadata } from "next";
import { getPageMetadata } from "@/utils/getPageMetadata";

export async function generateMetadata(): Promise<Metadata> {
    return getPageMetadata("/bank-details");
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
