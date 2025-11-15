import { i18n } from "@/i18n/config";
import { redirect } from "next/navigation";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout should never actually render since middleware redirects
    // But Next.js 16 requires a root layout
    redirect(`/${i18n.defaultLocale}`);
}
