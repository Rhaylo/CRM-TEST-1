'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileDown } from 'lucide-react';

interface DownloadContractButtonProps {
    contract: {
        id: number;
        status: string;
        dateSent: Date | null;
        client: {
            companyName: string;
            contactName: string;
            address: string | null;
            email: string | null;
        };
        deal: {
            amount: number;
            propertyAddress?: string; // Assuming deal might have property info or we use client address
        };
    };
}

export default function DownloadContractButton({ contract }: DownloadContractButtonProps) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('PURCHASE AND SALE AGREEMENT', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Contract ID: #${contract.id}`, 150, 40);

        // Parties
        doc.setFontSize(14);
        doc.text('1. PARTIES', 20, 55);
        doc.setFontSize(12);
        doc.text(`This Agreement is made between:`, 20, 65);
        doc.text(`SELLER: ${contract.client.companyName} (${contract.client.contactName})`, 20, 75);
        doc.text(`BUYER: Wholesale CRM LLC`, 20, 85);

        // Property
        doc.setFontSize(14);
        doc.text('2. PROPERTY', 20, 100);
        doc.setFontSize(12);
        doc.text(`Address: ${contract.client.address || 'N/A'}`, 20, 110);

        // Purchase Price
        doc.setFontSize(14);
        doc.text('3. PURCHASE PRICE', 20, 125);
        doc.setFontSize(12);
        doc.text(`The total purchase price shall be: $${contract.deal.amount.toLocaleString()}`, 20, 135);

        // Terms
        doc.setFontSize(14);
        doc.text('4. TERMS', 20, 150);
        doc.setFontSize(10);
        const terms = [
            'This agreement is contingent upon Buyer\'s inspection and approval of the property.',
            'Closing shall occur on or before 30 days from the effective date.',
            'Buyer pays all closing costs.',
            'Property is sold "AS-IS" with no warranties.',
        ];

        let yPos = 160;
        terms.forEach((term, index) => {
            doc.text(`${index + 1}. ${term}`, 20, yPos);
            yPos += 10;
        });

        // Signatures
        doc.line(20, 240, 90, 240);
        doc.text('Seller Signature', 20, 245);

        doc.line(120, 240, 190, 240);
        doc.text('Buyer Signature', 120, 245);

        // Save
        doc.save(`Contract_${contract.client.companyName}_${contract.id}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
        >
            <FileDown size={16} />
            Download PDF
        </button>
    );
}
