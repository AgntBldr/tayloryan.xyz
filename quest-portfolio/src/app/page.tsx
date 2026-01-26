import Link from 'next/link';
import questsData from '@/data/quests.json';
import { Badge } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Quest Portfolio
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                    A collection of on-chain activitations and campaigns designed to drive growth and engagement.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {questsData.map((quest) => (
                    <Link
                        href={`/quest/${quest.id}`}
                        key={quest.id}
                        className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 transition-all hover:shadow-2xl hover:shadow-purple-900/20 block"
                    >
                        <div className="h-48 bg-neutral-800 relative">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-bold text-xl">
                                {quest.project}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                                    {quest.type}
                                </span>
                                <span className="text-xs text-neutral-500">
                                    {quest.activations} Activations
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                                {quest.title}
                            </h2>

                            <p className="text-sm text-neutral-400 line-clamp-2">
                                {quest.description || "Interactive web3 campaign."}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
