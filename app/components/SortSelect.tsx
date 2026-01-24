'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './ClientList.module.css';

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    return (
        <select
            className={styles.select}
            value={currentSort}
            onChange={(e) => {
                router.push(`/?sort=${e.target.value}`);
            }}
        >
            <option value="newest">Newest Leads</option>
            <option value="oldest">Oldest Leads</option>
            <option value="motivation">Highest Motivation</option>
        </select>
    );
}
