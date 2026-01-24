
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createInternalTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Standard-ish size

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;

    const drawText = (text, x, y, size = fontSize) => {
        page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    };

    drawText('REAL ESTATE PURCHASE AGREEMENT', 150, 750, 20);

    drawText('Date: _______________________', 50, 700);
    drawText('Buyer: _______________________', 50, 670);
    drawText('Seller: _______________________', 50, 640);

    drawText('Property Address:', 50, 600);
    drawText('__________________________________________________________', 50, 580);

    drawText('Purchase Price: $________________', 50, 540);

    drawText('Terms:', 50, 500);
    drawText('1. Earnest Money: $________________', 70, 480);
    drawText('2. Closing Date: ________________', 70, 460);

    drawText('Signatures:', 50, 300);
    drawText('Buyer: ___________________  Date: ________', 50, 250);
    drawText('Seller: ___________________  Date: ________', 50, 200);

    const pdfBytes = await pdfDoc.save();

    const dir = path.join(__dirname, '../public/templates');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, 'contract_template.pdf'), pdfBytes);
    console.log('Dummy contract template created at public/templates/contract_template.pdf');
}

createInternalTemplate().catch(err => console.log(err));
