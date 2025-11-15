import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rubik_Mono_One } from "next/font/google";
import "../globals.css";
import { i18n } from "@/i18n/config";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const rubikMonoOne = Rubik_Mono_One({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-rubik-mono-one",
});

export const metadata: Metadata = {
    title: "itsmycv | Your Digital CV",
    description: "Create, Edit and Transfer your CV instantly and securely, in One-Click | 100% Free. A Digital CV/Portfolio Identity Platform for Belgian users.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "itsmycv",
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/icon-192x192.png',
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#1a1d2e",
};

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

type Params = Promise<{ lang: string }>;

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) {
    const { lang } = await params;

    return (
        <html lang={lang}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${rubikMonoOne.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
