'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Send, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { APP_CONFIG } from '@/lib/constants';
import { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

export default function SupportPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = use(params);
    const t = getTranslations(lang);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Send directly to Web3Forms from client side to avoid Cloudflare blocking
            const formDataToSend = new FormData();
            formDataToSend.append('access_key', '522d3750-c321-47e4-a360-f0d409f22c9a');
            formDataToSend.append('subject', `[ItsMyCV] ${formData.subject}`);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('message', `
Category: ${formData.category}

Message:
${formData.message}

---
From: ${formData.name} (${formData.email})
Sent: ${new Date().toLocaleString()}
            `);
            formDataToSend.append('redirect', 'false');

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setIsSubmitting(false);

                // Reset form after 5 seconds
                setTimeout(() => {
                    setSubmitted(false);
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        category: 'general',
                        message: ''
                    });
                }, 5000);
            } else {
                setError(data.message || 'Failed to send message. Please try again.');
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to send message. Please check your connection and try again.');
            setIsSubmitting(false);
        }
    };

    const supportCategories = [
        { value: 'general', label: t.support.formCategoryGeneral },
        { value: 'technical', label: t.support.formCategoryTechnical },
        { value: 'billing', label: t.support.formCategoryBilling },
        { value: 'feature', label: t.support.formCategoryFeature },
        { value: 'bug', label: t.support.formCategoryBug }
    ];



    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            {/* Hero Section */}
            <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black px-2">
                            {t.support.title}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            {t.support.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* Email Contact Button */}
            <section className="py-6 sm:py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-[#ff007a] to-[#ff3399] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                    {t.support.quickContact}
                                </h2>
                                <p className="text-white/90 text-sm sm:text-base md:text-lg">
                                    {t.support.quickContactDesc}
                                </p>
                            </div>
                            <a
                                href={`mailto:${APP_CONFIG.email}`}
                                className="bg-white text-[#ff007a] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2 group touch-manipulation active:scale-95 w-full sm:w-auto justify-center"
                            >
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                                <span className="break-all sm:break-normal">{APP_CONFIG.email}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - Form and Info */}
            <section className="py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                                <h2 className="text-2xl font-bold text-black mb-6">
                                    {t.support.getInTouch}
                                </h2>

                                {submitted ? (
                                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {t.support.successTitle}
                                        </h3>
                                        <p className="text-gray-600">
                                            {t.support.successMessage}
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.support.formName} *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff007a] focus:outline-none text-gray-900"
                                                placeholder={t.support.formNamePlaceholder}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.support.formEmail} *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff007a] focus:outline-none text-gray-900"
                                                placeholder={t.support.formEmailPlaceholder}
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.support.formCategory} *
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                required
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff007a] focus:outline-none text-gray-900"
                                            >
                                                {supportCategories.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.support.formSubject} *
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff007a] focus:outline-none text-gray-900"
                                                placeholder={t.support.formSubjectPlaceholder}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.support.formMessage} *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ff007a] focus:outline-none text-gray-900 resize-none"
                                                placeholder={t.support.formMessagePlaceholder}
                                            />
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#ff007a] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-black transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {t.support.formSending}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    {t.support.formSend}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Office Info */}
                            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                    {t.support.contactInfo}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-[#ff007a] flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{t.support.location}</p>
                                            <p className="text-sm text-gray-600">{t.support.locationValue}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-5 h-5 text-[#ff007a] flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{t.support.email}</p>
                                            <a
                                                href={`mailto:${APP_CONFIG.email}`}
                                                className="text-sm text-[#ff007a] hover:underline"
                                            >
                                                {APP_CONFIG.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Link */}
                            <div className="bg-[#ff007a]/5 border-2 border-[#ff007a]/20 rounded-2xl p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                    {t.support.quickLinks}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {t.support.quickLinksDesc}
                                </p>
                                <Link
                                    href={`/${lang}/faq`}
                                    className="inline-flex items-center text-[#ff007a] font-medium hover:underline"
                                >
                                    {t.support.faqLink}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            <Footer lang={lang} />
        </div>
    );
}
