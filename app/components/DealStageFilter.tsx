'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ClientList.module.css';

type DealStageFilterProps = {
    status: string;
    sort: string;
    query?: string;
    dealStage: string;
    hasDealStageParam: boolean;
};

const STORAGE_KEY = 'clientsDealStage';

export default function DealStageFilter({ status, sort, query, dealStage, hasDealStageParam }: DealStageFilterProps) {
    const router = useRouter();

    const handleChange = (value: string) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, value);
        }
        const params = new URLSearchParams();
        params.set('status', status);
        if (sort) params.set('sort', sort);
        if (query) params.set('q', query);
        if (value !== 'all') {
            params.set('dealStage', value);
        }
        const next = params.toString();
        router.push(next ? `/clients?${next}` : '/clients');
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!hasDealStageParam) {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored && stored !== 'all' && stored !== dealStage) {
                const params = new URLSearchParams();
                params.set('status', status);
                if (sort) params.set('sort', sort);
                if (query) params.set('q', query);
                params.set('dealStage', stored);
                router.replace(`/clients?${params.toString()}`);
                return;
            }
        }
        window.localStorage.setItem(STORAGE_KEY, dealStage);
    }, [dealStage, hasDealStageParam, query, router, sort, status]);

    return (
        <div className={styles.dealFilter}>
            <label className={styles.dealFilterLabel} htmlFor="deal-stage-filter">
                Deal Stage
            </label>
            <select
                id="deal-stage-filter"
                className={styles.dealFilterSelect}
                value={dealStage}
                onChange={(event) => handleChange(event.target.value)}
            >
                <option value="all">All Deals</option>
                <option value="none">No Deal (Leads)</option>
                <option value="Lead">Lead</option>
                <option value="Due Diligence">Due Diligence</option>
                <option value="Contract Sent">Contract Sent</option>
                <option value="Under Contract">Under Contract</option>
                <option value="Marketing">Marketing</option>
                <option value="Buyer Found">Buyer Found</option>
                <option value="Sold">Sold</option>
                <option value="Fall Through">Fall Through</option>
            </select>
        </div>
    );
}
