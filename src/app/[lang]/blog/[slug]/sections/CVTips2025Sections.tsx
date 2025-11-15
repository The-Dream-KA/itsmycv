interface CVTips2025SectionsProps {
    content: any;
}

export default function CVTips2025Sections({ content }: CVTips2025SectionsProps) {
    const { sections } = content;

    return (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            {/* Introduction */}
            <p className="text-xl font-medium text-black">
                {content.intro}
            </p>

            {/* Tips Section */}
            {'tips' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.tips.title}
                    </h2>
                    {sections.tips.list.map((tip: any, idx: number) => (
                        <div key={idx} className="my-10 pb-8 border-b border-gray-200 last:border-0">
                            <h3 className="text-2xl font-bold text-[#ff007a] mb-4">
                                {tip.number}. {tip.title}
                            </h3>
                            <p className="mb-4 text-gray-700">{tip.content}</p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-xl">
                                <p className="text-sm font-semibold text-blue-900 mb-2">💡 Why it matters:</p>
                                <p className="text-sm text-blue-800">{tip.why}</p>
                            </div>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-xl">
                                <p className="text-sm font-semibold text-green-900 mb-2">✅ Action step:</p>
                                <p className="text-sm text-green-800">{tip.action}</p>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Bonus Tips */}
            {'bonus' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.bonus.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 my-8">
                        {sections.bonus.tips.map((tip: any, idx: number) => (
                            <div key={idx} className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                                <p className="font-bold text-yellow-900 mb-2">⭐ {tip.title}</p>
                                <p className="text-sm text-yellow-800">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Common Mistakes */}
            {'mistakes' in sections && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.mistakes.title}
                    </h2>
                    <div className="space-y-4 my-8">
                        {sections.mistakes.list.map((item: any, idx: number) => (
                            <div key={idx} className="bg-red-50 border-l-4 border-red-400 p-5 rounded-r-xl">
                                <p className="font-semibold text-red-900 mb-2">❌ {item.mistake}</p>
                                <p className="text-sm text-green-700">✓ {item.fix}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Future Section */}
            {'future' in sections && !('intro' in sections.future) && (
                <>
                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                        {sections.future.title}
                    </h2>
                    <p>{sections.future.content}</p>
                </>
            )}
        </div>
    );
}
