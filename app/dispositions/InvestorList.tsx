'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';

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
            {/* Filters Section */}
            <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search investors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', minWidth: '150px' }}
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Do Not Contact">Do Not Contact</option>
                </select>

                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', minWidth: '150px' }}
                >
                    <option value="All">All States</option>
                    {states.map(state => (
                        <option key={state} value={state as string}>{state}</option>
                    ))}
                </select>

                <select
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                    style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', minWidth: '150px' }}
                >
                    <option value="All">All Zones</option>
                    {zones.map(zone => (
                        <option key={zone} value={zone as string}>{zone}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Contact</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Location</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Buying Criteria</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Deals Closed</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvestors.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    No investors found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredInvestors.map((investor) => (
                                <tr key={investor.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <Link href={`/dispositions/${investor.id}`} style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}>
                                            {investor.contactName}
                                        </Link>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{investor.companyName}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{investor.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>
                                        {investor.state || investor.zone ? (
                                            <div>
                                                {investor.zone && <div style={{ fontWeight: '500' }}>{investor.zone}</div>}
                                                {investor.state && <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{investor.state}</div>}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: investor.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                            color: investor.status === 'Active' ? '#166534' : '#64748b',
                                        }}>
                                            {investor.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#475569', maxWidth: '300px' }}>
                                        {investor.buyingCriteria ? (
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {investor.buyingCriteria}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>{investor.deals.length}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <Link
                                            href={`/dispositions/${investor.id}`}
                                            style={{
                                                display: 'inline-block',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.375rem',
                                                color: '#475569',
                                                fontSize: '0.875rem',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
<<<<<<< HEAD
<<<<<<< HEAD



        </div >
=======
        </div>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
=======
        </div>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
    );
}
