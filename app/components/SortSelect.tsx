'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ClientList.module.css';

type SortSelectProps = {
    status: string;
    dealStage: string;
    query?: string;
    sort: string;
    hasSortParam: boolean;
};

const STORAGE_KEY = 'clientsSort';

export default function SortSelect({ status, dealStage, query, sort, hasSortParam }: SortSelectProps) {
    const router = useRouter();

    const handleChange = (value: string) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, value);
        }
        const params = new URLSearchParams();
        params.set('status', status);
        if (query) params.set('q', query);
        if (dealStage !== 'all') params.set('dealStage', dealStage);
        if (value !== 'newest') params.set('sort', value);
        const next = params.toString();
        router.push(next ? `/clients?${next}` : '/clients');
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!hasSortParam) {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored && stored !== sort) {
                const params = new URLSearchParams();
                params.set('status', status);
                if (query) params.set('q', query);
                if (dealStage !== 'all') params.set('dealStage', dealStage);
                params.set('sort', stored);
                router.replace(`/clients?${params.toString()}`);
                return;
            }
        }
        window.localStorage.setItem(STORAGE_KEY, sort);
    }, [dealStage, hasSortParam, query, router, sort, status]);

    return (
        <select
            className={styles.select}
            value={sort}
            onChange={(event) => handleChange(event.target.value)}
        >
            <option value="newest">Newest Leads</option>
            <option value="oldest">Oldest Leads</option>
            <option value="motivation">Highest Motivation</option>
        </select>
    );
}
