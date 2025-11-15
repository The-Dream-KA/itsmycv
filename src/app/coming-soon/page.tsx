import { redirect } from 'next/navigation';
import { i18n } from '@/i18n/config';

export default function ComingSoonRedirect() {
    redirect(`/${i18n.defaultLocale}/coming-soon`);
}
