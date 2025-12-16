import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Rubik_Mono_One } from "next/font/google";
import "../globals.css";
import { i18n } from "@/i18n/config";
import { getVerifiedUser } from "@/lib/auth";
import { AuthProvider } from "@/context/AuthContext";

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

export const dynamic = 'force-dynamic';

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
            { url: 'https://res.cloudinary.com/docxvgl2f/image/upload/v1763148966/itsmycv-logo-pink_dkyfav.svg', type: 'image/svg+xml' },
        ],
        apple: 'https://res.cloudinary.com/docxvgl2f/image/upload/v1763148966/itsmycv-logo-pink_dkyfav.svg',
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
    const initialUser = await getVerifiedUser();

    return (
        <html lang={lang}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${rubikMonoOne.variable} antialiased`}
            >
                <AuthProvider initialUser={initialUser}>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
