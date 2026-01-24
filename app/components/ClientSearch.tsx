'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function ClientSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [text, setText] = useState(searchParams.get('q') || '');

    // Simple debounce logic without extra deps
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (text !== currentQ) {
                if (text) {
                    router.push(`/clients?q=${encodeURIComponent(text)}`);
                } else {
                    router.push('/clients');
                }
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [text, router, searchParams]);

    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={text}
                onChange={e => setText(e.target.value)}
            />
        </div>
    );
}
