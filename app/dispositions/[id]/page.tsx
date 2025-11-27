import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building, Calendar } from 'lucide-react';
import InvestorNotes from './InvestorNotes';
import EditInvestorForm from './EditInvestorForm';
import ActiveDealsSection from './ActiveDealsSection';

export default async function InvestorDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch investor with deals and notes
    const investor = await prisma.investor.findUnique({
        where: { id: parseInt(id) },
        include: {
            deals: {
                orderBy: { createdAt: 'desc' },
                include: {
                    client: true, // Include client details for the deal
                }
            },
            notes: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    // Fetch all clients for the "Add Deal" dropdown
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, contactName: true, address: true },
    });

    if (!investor) {
        notFound();
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/dispositions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1.5rem' }}>
                <ArrowLeft size={16} />
                Back to Dispositions
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                {/* Left Column: Profile Info */}
                <div>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.25rem' }}>{investor.contactName}</h1>
                            {investor.companyName && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                                    <Building size={14} />
                                    {investor.companyName}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Mail size={16} />
                                <a href={`mailto:${investor.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{investor.email || 'No email'}</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Phone size={16} />
                                <a href={`tel:${investor.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{investor.phone || 'No phone'}</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Calendar size={16} />
                                <span>Added {new Date(investor.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                backgroundColor: investor.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                                color: investor.status === 'Active' ? '#166534' : '#64748b',
                                width: '100%',
                                textAlign: 'center',
                            }}>
                                {investor.status}
                            </span>
                        </div>

                        <EditInvestorForm investor={investor} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Buying Criteria</h3>
                        <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {investor.buyingCriteria || 'No criteria specified.'}
                        </p>
                    </div>
                </div>

                {/* Right Column: Active Deals & Notes */}
                <div>
                    {/* Active Deals Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <ActiveDealsSection
                            investorId={investor.id}
                            deals={investor.deals}
                            clients={clients}
                        />
                    </div>

                    {/* Notes Section */}
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                            Notes & History
                        </h2>
                        <InvestorNotes investorId={investor.id} notes={investor.notes} />
                    </div>
                </div>
            </div>
        </div>
    );
}
