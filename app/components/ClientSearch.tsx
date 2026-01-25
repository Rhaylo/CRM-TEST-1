'use client';

import { Search, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './ClientSearch.module.css';

type ClientSuggestion = {
    id: number;
    contactName: string;
    email: string | null;
    phone: string | null;
    status: string | null;
};

const suggestionDelay = 250;

export default function ClientSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [text, setText] = useState(searchParams.get('q') || '');
    const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        const trimmed = text.trim();
        if (!trimmed) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/clients/search?q=${encodeURIComponent(trimmed)}`, {
                    signal: controller.signal,
                });
                if (!res.ok) {
                    setSuggestions([]);
                    setIsOpen(false);
                    return;
                }
                const data = await res.json();
                const results = Array.isArray(data) ? data : [];
                setSuggestions(results);
                setIsOpen(results.length > 0);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setSuggestions([]);
                    setIsOpen(false);
                }
            } finally {
                setIsLoading(false);
            }
        }, suggestionDelay);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [text]);

    const statusClass = (status?: string | null) => {
        if (!status) return styles.statusNeutral;
        if (status.toLowerCase() === 'active') return styles.statusActive;
        if (status.toLowerCase() === 'snoozed') return styles.statusSnoozed;
        if (status.toLowerCase() === 'archived') return styles.statusArchived;
        if (status.toLowerCase() === 'fall through') return styles.statusFallThrough;
        return styles.statusNeutral;
    };

    const handleSelect = (clientId: number) => {
        setIsOpen(false);
        router.push(`/clients/${clientId}`);
    };

    return (
        <div className={styles.search}>
            <Search className={styles.searchIcon} size={18} />
            <input
                type="text"
                placeholder="Search clients..."
                className={styles.searchInput}
                value={text}
                onChange={(event) => setText(event.target.value)}
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setIsOpen(true);
                    }
                }}
                onBlur={() => {
                    setTimeout(() => setIsOpen(false), 150);
                }}
            />

            {isOpen && (
                <div className={styles.dropdown}>
                    {isLoading ? (
                        <div className={styles.loadingRow}>Searching...</div>
                    ) : (
                        suggestions.map((client) => (
                            <button
                                key={client.id}
                                type="button"
                                className={styles.resultItem}
                                onMouseDown={() => handleSelect(client.id)}
                            >
                                <div className={styles.resultTitleRow}>
                                    <div className={styles.resultTitle}>
                                        <User size={16} />
                                        {client.contactName}
                                    </div>
                                    <span className={`${styles.statusTag} ${statusClass(client.status)}`}>
                                        {client.status || 'Working'}
                                    </span>
                                </div>
                                <div className={styles.resultMeta}>
                                    <span>{client.email || 'No email'}</span>
                                    <span>{client.phone || 'No phone'}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
