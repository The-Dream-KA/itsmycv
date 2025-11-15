export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout should never actually render since middleware redirects
    // But Next.js 16 requires a root layout
    return children;
}
