interface DigitalCVFutureSectionsProps {
    content: any;
}

export default function DigitalCVFutureSections({ content }: DigitalCVFutureSectionsProps) {
    const { sections } = content;

    return (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            {/* Introduction */}
            <p className="text-xl font-medium text-black">
                {content.intro}
            </p>

            {/* Problem Section */}
            {'problem' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.problem.title}
                    </h2>
                    <p>{sections.problem.intro}</p>
                    <div className="bg-gray-50 border-l-4 border-[#ff007a] p-6 my-8 rounded-r-2xl">
                        <ul className="space-y-3 text-gray-700">
                            {sections.problem.points.map((point: any, idx: number) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-[#ff007a] font-bold mr-3">→</span>
                                    <span><strong>{point.title}:</strong> {point.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Solution Section */}
            {'solution' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.solution.title}
                    </h2>
                    <p>{sections.solution.intro}</p>
                    <h3 className="text-2xl font-bold text-black mt-8 mb-4">
                        {sections.solution.featuresTitle}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        {sections.solution.features.map((feature: any, idx: number) => (
                            <div key={idx} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#ff007a] transition-colors">
                                <h4 className="text-xl font-bold text-black mb-3">{feature.icon} {feature.title}</h4>
                                <p className="text-gray-700">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Job Seekers Section */}
            {'jobSeekers' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.jobSeekers.title}
                    </h2>
                    <p>{sections.jobSeekers.intro}</p>
                    {sections.jobSeekers.benefits.map((benefit: any, idx: number) => (
                        <p key={idx}>
                            <strong className="text-black">{benefit.title}:</strong> {benefit.desc}
                        </p>
                    ))}
                </>
            )}

            {/* Employers Section */}
            {'employers' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.employers.title}
                    </h2>
                    <p>{sections.employers.intro}</p>
                    <div className="bg-gradient-to-r from-[#ff007a]/10 to-pink-50 rounded-2xl p-8 my-8">
                        <ul className="space-y-4 text-gray-700">
                            {sections.employers.benefits.map((benefit: any, idx: number) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-black">{benefit.title}:</strong> {benefit.desc}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Privacy Section */}
            {'privacy' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.privacy.title}
                    </h2>
                    <p>{sections.privacy.content}</p>
                </>
            )}

            {/* Belgium Section */}
            {'belgium' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.belgium.title}
                    </h2>
                    <p>{sections.belgium.content}</p>
                </>
            )}

            {/* Future Section */}
            {'future' in sections && 'intro' in sections.future && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.future.title}
                    </h2>
                    <p>{sections.future.intro}</p>
                    {'innovations' in sections.future && (
                        <ul className="space-y-3 my-6">
                            {sections.future.innovations.map((innovation: any, idx: number) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-[#ff007a] text-xl mr-3">•</span>
                                    <span><strong>{innovation.title}:</strong> {innovation.desc}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {/* First Step Section */}
            {'firstStep' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.firstStep.title}
                    </h2>
                    <p>{sections.firstStep.intro}</p>
                    <ol className="space-y-4 my-6 ml-6">
                        {sections.firstStep.steps.map((step: any, idx: number) => (
                            <li key={idx} className="text-gray-700">
                                <strong className="text-black">{idx + 1}. {step.title}:</strong> {step.desc}
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </div>
    );
}
