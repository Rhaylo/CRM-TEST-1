'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import styles from './InvestorList.module.css';

interface Investor {
    id: number;
    contactName: string;
    companyName: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    buyingCriteria: string | null;
    state: string | null;
    zone: string | null;
    deals: any[];
}

export default function InvestorList({ initialInvestors }: { initialInvestors: Investor[] }) {
    const [investors, setInvestors] = useState(initialInvestors);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [stateFilter, setStateFilter] = useState('All');
    const [zoneFilter, setZoneFilter] = useState('All');

    // Get unique states and zones for filter dropdowns
    const states = Array.from(new Set(initialInvestors.map(i => i.state).filter(Boolean)));
    const zones = Array.from(new Set(initialInvestors.map(i => i.zone).filter(Boolean)));

    const filteredInvestors = investors.filter(investor => {
        const matchesSearch =
            investor.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (investor.companyName && investor.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (investor.email && investor.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || investor.status === statusFilter;
        const matchesState = stateFilter === 'All' || investor.state === stateFilter;
        const matchesZone = zoneFilter === 'All' || investor.zone === zoneFilter;

        return matchesSearch && matchesStatus && matchesState && matchesZone;
    });

    return (
        <div>
            <div className={styles.filters}>
                <div className={styles.searchWrap}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search investors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.select}
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                </select>

                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className={styles.select}
                >
                    <option value="All">All States</option>
                    {states.map(state => (
                        <option key={state} value={state as string}>{state}</option>
                    ))}
                </select>

                <select
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                    className={styles.select}
                >
                    <option value="All">All Zones</option>
                    {zones.map(zone => (
                        <option key={zone} value={zone as string}>{zone}</option>
                    ))}
                </select>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Contact</th>
                            <th className={styles.th}>Location</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Buying Criteria</th>
                            <th className={styles.th}>Deals Closed</th>
                            <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvestors.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                    No investors found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredInvestors.map((investor) => (
                                <tr key={investor.id} className={styles.row}>
                                    <td className={styles.td}>
                                        <Link href={`/dispositions/${investor.id}`} className={styles.nameLink}>
                                            {investor.contactName}
                                        </Link>
                                        <div className={styles.subText}>{investor.companyName}</div>
                                        <div className={styles.subText}>{investor.email}</div>
                                    </td>
                                    <td className={styles.td}>
                                        {investor.state || investor.zone ? (
                                            <div>
                                                {investor.zone && <div style={{ fontWeight: 600 }}>{investor.zone}</div>}
                                                {investor.state && <div className={styles.subText}>{investor.state}</div>}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={`${styles.statusBadge} ${
                                                investor.status === 'Active'
                                                    ? styles.statusActive
                                                    : investor.status === 'Do Not Contact'
                                                        ? styles.statusNoContact
                                                        : styles.statusInactive
                                            }`}
                                        >
                                            {investor.status}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {investor.buyingCriteria ? (
                                            <div className={styles.criteriaText}>
                                                {investor.buyingCriteria}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className={styles.td}>{investor.deals.length}</td>
                                    <td className={styles.td} style={{ textAlign: 'right' }}>
                                        <Link href={`/dispositions/${investor.id}`} className={styles.actionButton}>
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
