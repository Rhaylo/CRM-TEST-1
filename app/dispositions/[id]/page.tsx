import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building, Calendar } from 'lucide-react';
import InvestorNotes from './InvestorNotes';
import EditInvestorForm from './EditInvestorForm';
import ActiveDealsSection from './ActiveDealsSection';
import InvestorNavigation from './InvestorNavigation';
import styles from './InvestorProfile.module.css';

export default async function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

    // Get all investor IDs for navigation
    const allInvestors = await prisma.investor.findMany({
        select: { id: true },
        orderBy: { createdAt: 'desc' },
    });

    const currentIndex = allInvestors.findIndex(i => i.id === investor.id);
    const prevInvestorId = currentIndex > 0 ? allInvestors[currentIndex - 1].id : null;
    const nextInvestorId = currentIndex < allInvestors.length - 1 ? allInvestors[currentIndex + 1].id : null;

    return (
        <div className={styles.container}>
            <InvestorNavigation
                prevInvestorId={prevInvestorId}
                nextInvestorId={nextInvestorId}
                currentIndex={currentIndex + 1}
                totalInvestors={allInvestors.length}
            />
            <Link href="/dispositions" className={styles.backLink}>
                <ArrowLeft size={16} />
                Back to Dispositions
            </Link>

            <div className={styles.grid}>
                {/* Left Column: Profile Info */}
                <div>
                    <div className={styles.card}>
                        <div className={styles.profileHeader}>
                            <h1 className={styles.name}>{investor.contactName}</h1>
                            {investor.companyName && (
                                <div className={styles.companyRow}>
                                    <Building size={14} />
                                    {investor.companyName}
                                </div>
                            )}
                        </div>

                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <Mail size={16} />
                                <a href={`mailto:${investor.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{investor.email || 'No email'}</a>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={16} />
                                <a href={`tel:${investor.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{investor.phone || 'No phone'}</a>
                            </div>
                            <div className={styles.contactItem}>
                                <Calendar size={16} />
                                <span>Added {new Date(investor.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <span
                                className={`${styles.statusBadge} ${
                                    investor.status === 'Active'
                                        ? styles.statusActive
                                        : investor.status === 'Do Not Contact'
                                            ? styles.statusDnc
                                            : styles.statusInactive
                                }`}
                            >
                                {investor.status}
                            </span>
                        </div>

                        <EditInvestorForm investor={investor} />
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>Buying Criteria</h3>
                        <p className={styles.criteriaText}>
                            {investor.buyingCriteria || 'No criteria specified.'}
                        </p>
                    </div>
                </div>

                {/* Right Column: Active Deals & Notes */}
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <ActiveDealsSection
                            investorId={investor.id}
                            deals={investor.deals}
                            clients={clients}
                        />
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.notesHeader}>Notes & History</h2>
                        <InvestorNotes investorId={investor.id} notes={investor.notes} />
                    </div>
                </div>
            </div>
        </div>
    );
}
