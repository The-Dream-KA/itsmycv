interface ConclusionSectionProps {
    title: string;
    content: string;
}

export default function ConclusionSection({ title, content }: ConclusionSectionProps) {
    return (
        <>
            <h2 className="text-3xl font-bold text-black mt-12 mb-6">
                {title}
            </h2>
            <p>{content}</p>
        </>
    );
}
