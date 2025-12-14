import jsPDF from 'jspdf';

interface DealData {
    address: string;
    askingPrice: number;
    arv: number;
    repairs: number | string;
    photos?: string[]; // Links
    titleStatus?: string;
    offerDeadline?: string; // Date string
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export const generateBuyerPacket = (data: DealData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Header --
    doc.setFillColor(30, 41, 59); // Dark slate blue (matches dashboard theme)
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVESTOR DEAL SHEET', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Exclusive Off-Market Opportunity', pageWidth / 2, 28, { align: 'center' });

    // -- Property Details --
    let y = 60;
    const labelX = 20;
    const valueX = 80;

    doc.setTextColor(33, 41, 59); // Dark text

    // Address (Highlight)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.address, 20, y);
    y += 15;

    // Financials
    doc.setFontSize(12);

    // Asking Price (Wholesale Price)
    doc.setFont('helvetica', 'bold');
    doc.text('Wholesale Price:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${data.askingPrice.toLocaleString()}`, valueX, y);
    y += 10;

    // ARV
    doc.setFont('helvetica', 'bold');
    doc.text('Estimated ARV:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${data.arv.toLocaleString()}`, valueX, y);
    y += 10;

    // Repairs
    doc.setFont('helvetica', 'bold');
    doc.text('Est. Repairs:', labelX, y);
    doc.setFont('helvetica', 'normal');
    const repairsText = typeof data.repairs === 'number'
        ? `$${data.repairs.toLocaleString()}`
        : data.repairs;
    doc.text(repairsText.toString(), valueX, y);
    y += 10;

    // Profit Potential (Calculated)
    const repairsCost = typeof data.repairs === 'number' ? data.repairs : 0;
    const profit = data.arv - data.askingPrice - repairsCost;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74); // Green
    doc.text('GROSS SPREAD:', labelX, y);
    doc.text(`$${profit.toLocaleString()}`, valueX, y);
    doc.setTextColor(33, 41, 59); // Reset
    y += 15;

    // Title Status & Contact
    doc.setFont('helvetica', 'bold');
    doc.text('Title Status:', labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.titleStatus || 'Open / Clear', valueX, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Contact Email:', labelX, y);
    doc.setFont('helvetica', 'normal');
    // @ts-ignore
    doc.text(data.contactEmail || 'adrian@xyreholdings.com', valueX, y);
    y += 20;

    // -- Deal Info --
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y - 5, pageWidth - 20, y - 5);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Deal Information:', 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title Status: ${data.titleStatus || 'Open / Clear'}`, 20, y);
    y += 7;
    doc.text(`Offer Deadline: ${data.offerDeadline || 'First Come, First Serve'}`, 20, y);
    y += 15;

    // -- Photos --
    if (data.photos && data.photos.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Photos / Media:', 20, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(37, 99, 235); // Blue link color

        data.photos.forEach((photo) => {
            // doc.textWithLink(photo, 20, y, { url: photo }); // textWithLink might not be standard in basic types, checking
            // Fallback: just text
            doc.text(photo, 20, y);
            y += 7;
        });
        doc.setTextColor(33, 41, 59); // Reset
        y += 10;
    }

    // -- Footer --
    const footerY = doc.internal.pageSize.getHeight() - 30;
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    doc.line(20, footerY, pageWidth - 20, footerY);

    doc.setFontSize(10);
    doc.text('Presented by:', 20, footerY + 10);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('XYRE HOLDINGS', 20, footerY + 16);

    if (data.contactEmail) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${data.contactEmail}`, 20, footerY + 22);
    }

    doc.save('Investor Deal Sheet.pdf');
};
