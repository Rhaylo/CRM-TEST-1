import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import DocumentList from './DocumentList';
import UploadDropzone from './UploadDropzone';
import Financials from './Financials'; // Keeping it if used elsewhere, or delete later
import DealCalculator from './DealCalculator';
import ClosingInfo from './ClosingInfo';

export default async function DealDetailPage(props: { params: Promise<{ id: string }> }) {
    // Next.js 15: params is a Promise
    const params = await props.params;
    const dealId = parseInt(params.id);

    const deal = await prisma.deal.findUnique({
        where: { id: dealId },
        include: {
            client: true,
            documents: {
                orderBy: { createdAt: 'desc' }
            },
            titleCompany: true,
            escrowAgent: true
        }
    });

    const titleCompanies = await prisma.titleCompany.findMany({
        include: { escrowAgents: true },
        orderBy: { name: 'asc' }
    });

    if (!deal) {
        notFound();
    }

    // Calculate financials
    // Calculate financials
    const arv = deal.client.arv || 0;
    const repairs = deal.client.repairs || 0;
    const ourOffer = deal.client.ourOffer || 0;
    const wholesalePrice = deal.amount;

    // MAO & Potential
    const mao = (arv * 0.7) - repairs;
    const potentialProfit = mao - ourOffer;

    // Actual Profit
    const calculatedProfit = wholesalePrice - ourOffer;
    const assignmentFee = deal.assignmentFee ?? calculatedProfit;

    // Determine what to show as "Projected Profit"
    // If no spread yet (wholesalePrice == ourOffer), show Potential
    const displayProfit = (assignmentFee > 0 || wholesalePrice !== ourOffer) ? assignmentFee : potentialProfit;
    const isPotential = (assignmentFee <= 0 && wholesalePrice === ourOffer);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* Header / Nav */}
            <div style={{ marginBottom: '2rem' }}>
                <Link
                    href="/deals"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#64748b',
                        textDecoration: 'none',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Pipeline
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                            {deal.products || 'Deal Details'}
                        </h1>
                        <p style={{ color: '#64748b' }}>
                            Client: <Link href={`/clients/${deal.clientId}`} style={{ color: '#3b82f6' }}>{deal.client.companyName}</Link>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '999px',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            {deal.stage}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Financials Section -> Deal Calculator */}
                    <div className="mb-8">
                        <DealCalculator deal={{
                            ...deal,
                            documents: [] // Remove heavy/binary data not needed for calculator
                        }} />
                    </div>

                    <div className="mb-8">
                        <ClosingInfo deal={deal} titleCompanies={titleCompanies} />
                    </div>

                    {/* Documents Section */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Edit size={20} />
                            Documents
                        </h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <UploadDropzone dealId={dealId} />
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', marginBottom: '1rem' }}>Uploaded Files ({deal.documents.length})</h3>
                            <DocumentList documents={deal.documents.map(d => ({
                                id: d.id,
                                fileName: d.fileName,
                                category: d.category,
                                createdAt: d.createdAt.toISOString()
                            }))} dealId={dealId} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Quick Actions</h3>
                        <Link
                            href={`/contracts`}
                            style={{
                                display: 'block',
                                padding: '0.75rem',
                                backgroundColor: '#f1f5f9',
                                color: '#334155',
                                textDecoration: 'none',
                                borderRadius: '0.5rem',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                                fontWeight: '500'
                            }}
                        >
                            Manage Contracts
                        </Link>
                        <Link
                            href={`/clients/${deal.clientId}`}
                            style={{
                                display: 'block',
                                padding: '0.75rem',
                                backgroundColor: '#f1f5f9',
                                color: '#334155',
                                textDecoration: 'none',
                                borderRadius: '0.5rem',
                                textAlign: 'center',
                                fontWeight: '500'
                            }}
                        >
                            View Client Info
                        </Link>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>Deal Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Created Date</p>
                                <p style={{ color: '#334155' }}>{deal.createdAt.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Owner</p>
                                <p style={{ color: '#334155' }}>{deal.owner || 'Unassigned'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
