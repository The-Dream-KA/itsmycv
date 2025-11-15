import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pains from '@/components/Pains';
import Services from '@/components/Services';
import Footer from '@/components/Footer';
import { Locale } from '@/i18n/config';

export default async function Home({
    params,
}: {
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />
            <main>
                <Hero lang={lang} />
                <Pains lang={lang} />
                <Services lang={lang} />
            </main>
            <Footer lang={lang} />
        </div>
    );
}
