import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import AddInvestorModal from './AddInvestorModal';
import InvestorList from './InvestorList';

<<<<<<< HEAD
// Force rebuild: Dispositions Page
export const dynamic = 'force-dynamic';

=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
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

            <InvestorList initialInvestors={investors} />
        </div>
    );
}
