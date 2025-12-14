import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DealSummaryData {
    client: {
        companyName: string;
        contactName: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        arv?: number;
        repairs?: number;
        ourOffer?: number;
        tasks: any[];
        notes: any[];
    };
    deal: {
        amount: number;
        assignmentFee?: number;
        stage: string;
        createdAt: Date;
        notes: any[];
    };
}

export const generateDealSummary = (data: DealSummaryData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // -- Header --
    doc.setFillColor(245, 158, 11); // Amber-500
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DEAL SUMMARY REPORT', 20, 20);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, 20, { align: 'right' });

    y = 45;
    doc.setTextColor(33, 41, 59);

    // -- Seller & Deal Info Grid --
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deal Overview', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Column 1: Seller
    doc.text(`Seller: ${data.client.contactName} (${data.client.companyName})`, 20, y);
    y += 6;
    doc.text(`Address: ${data.client.address || 'N/A'}`, 20, y);
    y += 6;
    doc.text(`Phone: ${data.client.phone || 'N/A'}`, 20, y);
    y += 6;
    doc.text(`Email: ${data.client.email || 'N/A'}`, 20, y);

    // Column 2: Deal Metrics (Right side)
    const col2X = pageWidth / 2 + 10;
    let y2 = 45 + 10; // Match y start

    doc.text(`Deal Amount (Wholesale Price): $${data.deal.amount.toLocaleString()}`, col2X, y2);
    y2 += 6;
    doc.text(`ARV: $${(data.client.arv || 0).toLocaleString()}`, col2X, y2);
    y2 += 6;
    doc.text(`Est. Repairs: $${(data.client.repairs || 0).toLocaleString()}`, col2X, y2);
    y2 += 6;
    doc.text(`Our Accepted Offer: $${(data.client.ourOffer || 0).toLocaleString()}`, col2X, y2);
    y2 += 6;

    // Assignment Fee
    const ourOffer = data.client.ourOffer || 0;
    const assignmentFee = data.deal.assignmentFee ?? (data.deal.amount - ourOffer);

    doc.setTextColor(22, 163, 74); // Green
    doc.text(`Assignment Fee: $${assignmentFee.toLocaleString()}`, col2X, y2);
    doc.setTextColor(33, 41, 59); // Reset
    y2 += 6;

    y2 += 4;
    doc.text(`Current Stage: ${data.deal.stage}`, col2X, y2);
    y2 += 6;
    doc.text(`Created Date: ${new Date(data.deal.createdAt).toLocaleDateString()}`, col2X, y2);

    y = Math.max(y, y2) + 15;

    // -- Tasks Table --
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tasks & Action Items', 20, y);
    y += 5;

    const taskRows = data.client.tasks.map(t => [
        t.title,
        t.status,
        t.priority,
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Task Name', 'Status', 'Priority', 'Due Date']],
        body: taskRows,
        headStyles: { fillColor: [59, 130, 246] }, // Blue
        styles: { fontSize: 9 },
        margin: { top: 10 }
    });

    // @ts-ignore
    y = doc.lastAutoTable.finalY + 15;

    // -- Recent Notes --
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Notes', 20, y);
    y += 5;

    // Combine notes
    const allNotes = [...data.client.notes, ...data.deal.notes]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map(n => [
            new Date(n.createdAt).toLocaleDateString(),
            n.content.replace(/<[^>]*>/g, '') // Strip HTML tags if any
        ]);

    autoTable(doc, {
        startY: y,
        head: [['Date', 'Note Content']],
        body: allNotes,
        headStyles: { fillColor: [100, 116, 139] }, // Slate
        columnStyles: { 1: { cellWidth: 130 } }, // Wider content col
        styles: { fontSize: 9 }
    });

    // Save
    doc.save(`Deal_Summary_${data.client.companyName}.pdf`);
};
