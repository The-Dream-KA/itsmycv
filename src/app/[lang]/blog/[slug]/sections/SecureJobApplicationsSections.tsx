interface SecureJobApplicationsSectionsProps {
    content: any;
}

export default function SecureJobApplicationsSections({ content }: SecureJobApplicationsSectionsProps) {
    const { sections } = content;

    return (
        <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
            {/* Introduction */}
            <p className="text-lg sm:text-xl font-medium text-black">
                {content.intro}
            </p>

            {/* Risks Section */}
            {'risks' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.risks.title}
                    </h2>
                    <p className="text-sm sm:text-base">{sections.risks.intro}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8">
                        {sections.risks.points.map((point: any, idx: number) => (
                            <div key={idx} className="bg-red-50 border-l-4 border-red-500 rounded-r-xl sm:rounded-r-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <span className="text-2xl sm:text-3xl flex-shrink-0">{point.icon}</span>
                                    <div className="min-w-0">
                                        <h4 className="text-base sm:text-lg font-bold text-black mb-1 sm:mb-2">{point.title}</h4>
                                        <p className="text-gray-700 text-xs sm:text-sm">{point.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Core Principles Section */}
            {'principles' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.principles.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">{sections.principles.intro}</p>
                    <div className="space-y-6 sm:space-y-8">
                        {sections.principles.items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-r from-blue-50 to-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border-2 border-blue-100">
                                <div className="flex items-start gap-4 sm:gap-6">
                                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-200 flex-shrink-0">{item.number}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3">{item.title}</h3>
                                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{item.desc}</p>
                                        <div className="bg-blue-100 border-l-4 border-[#ff007a] rounded-r-lg sm:rounded-r-xl p-3 sm:p-4">
                                            <p className="text-xs sm:text-sm text-gray-800">
                                                <strong className="text-[#ff007a]">💡 Tip:</strong> {item.tip}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* GDPR Section */}
            {'gdpr' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.gdpr.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">{sections.gdpr.intro}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8">
                        {sections.gdpr.rights.map((right: any, idx: number) => (
                            <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#ff007a] transition-colors">
                                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-2 sm:mb-3">⚖️ {right.title}</h4>
                                <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">{right.desc}</p>
                                <p className="text-xs sm:text-sm text-[#ff007a] font-semibold break-words">
                                    → {right.action}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 sm:p-6 my-6 sm:my-8 rounded-r-xl sm:rounded-r-2xl">
                        <p className="text-sm sm:text-base text-gray-800">
                            <strong className="text-black">📌 Important:</strong> {sections.gdpr.note}
                        </p>
                    </div>
                </>
            )}

            {/* Digital CVs Section */}
            {'digitalCvs' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.digitalCvs.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">{sections.digitalCvs.intro}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8">
                        {sections.digitalCvs.features.map((feature: any, idx: number) => (
                            <div key={idx} className="bg-gradient-to-br from-green-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-100 hover:shadow-xl transition-shadow">
                                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-2 sm:mb-3">
                                    <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{feature.icon}</span>
                                    {feature.title}
                                </h4>
                                <p className="text-sm sm:text-base text-gray-700">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Best Practices Section */}
            {'practices' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.practices.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">{sections.practices.intro}</p>
                    <div className="space-y-4 sm:space-y-6">
                        {sections.practices.tips.map((tip: any, idx: number) => (
                            <div key={idx} className="bg-white border-l-4 border-[#ff007a] rounded-r-xl sm:rounded-r-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <h4 className="text-base sm:text-lg font-bold text-black mb-2">
                                    {idx + 1}. {tip.title}
                                </h4>
                                <p className="text-sm sm:text-base text-gray-700">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* itsmycv Section */}
            {'itsmycv' in sections && (
                <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-black mt-8 sm:mt-12 mb-4 sm:mb-6">
                        {sections.itsmycv.title}
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">{sections.itsmycv.intro}</p>
                    <div className="bg-gradient-to-r from-[#ff007a]/10 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 my-6 sm:my-8">
                        <ul className="space-y-3 sm:space-y-4">
                            {sections.itsmycv.features.map((feature: any, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-[#ff007a] text-xl sm:text-2xl flex-shrink-0">✓</span>
                                    <div className="min-w-0">
                                        <strong className="text-black text-base sm:text-lg block">{feature.title}:</strong>
                                        <p className="text-sm sm:text-base text-gray-700">{feature.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
