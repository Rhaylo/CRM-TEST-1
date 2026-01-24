
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function checkPdf() {
    // Check the 'standard' one
    const filePath = path.join(__dirname, '../public/templates/Purchase Agreement .docx.pdf');

    try {
        if (!fs.existsSync(filePath)) {
            console.log("File not found:", filePath);
            return;
        }

        const pdfBuffer = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log(`Found ${fields.length} fields in PDF.`);
        fields.forEach(f => console.log(' - ' + f.getName()));

        if (fields.length === 0) {
            console.log("No form fields found. This is a flat PDF (requires X/Y coordinates).");
        }
    } catch (e) {
        console.error("Error reading PDF:", e);
    }
}

checkPdf();
