import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import AddInvestorModal from './AddInvestorModal';

export default async function DispositionsPage() {
    const investors = await prisma.investor.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            deals: true,
        },
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
                        Dispositions
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: 'normal',
                            color: '#64748b',
                            marginLeft: '0.75rem',
                            backgroundColor: '#f1f5f9',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px'
                        }}>
                            {investors.length}
                        </span>
                    </h1>
                    <p style={{ color: '#64748b' }}>Manage your investor network</p>
                </div>
                <AddInvestorModal />
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Contact</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Company</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Buying Criteria</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Deals Closed</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investors.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    No investors found. Add your first investor to get started.
                                </td>
                            </tr>
                        ) : (
                            investors.map((investor) => (
                                <tr key={investor.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <Link href={`/dispositions/${investor.id}`} style={{ fontWeight: '500', color: '#2563eb', textDecoration: 'none' }}>
                                            {investor.contactName}
                                        </Link>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{investor.email}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{investor.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#1e293b' }}>{investor.companyName || '-'}</td>
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
        </div>
    );
}
