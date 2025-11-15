import { Calendar, Clock } from 'lucide-react';

interface ArticleHeaderProps {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    author: string;
}

export default function ArticleHeader({
    title,
    excerpt,
    date,
    readTime,
    author,
}: ArticleHeaderProps) {
    return (
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
                    {title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                    {excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{readTime}</span>
                    </div>
                    <span>•</span>
                    <span className="font-medium text-black">{author}</span>
                </div>
            </div>
        </header>
    );
}
