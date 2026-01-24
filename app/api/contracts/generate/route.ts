import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { dealId, manualData, templateType } = await req.json();

        let data = manualData;

        // Fetch Deal Data ONLY if manualData is missing
        if (!data && dealId) {
            const deal = await prisma.deal.findUnique({
                where: { id: parseInt(dealId) },
                include: { client: true }
            });
            if (deal) {
                // Map Deal Fields to PDF Fields
                data = {
                    date: new Date().toLocaleDateString(),
                    buyer: "Wholesale Company LLC", // Default or from settings
                    seller: deal.client.contactName,
                    address: deal.client.address || "N/A",
                    price: deal.amount ? `$${deal.amount.toLocaleString()}` : "N/A",
                    earnestMoney: "$100.00",
                    closingDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "TBD"
                };
            }
        }

        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        // Determine Template File
        let filename = 'contract_template.pdf'; // Default dummy
        if (templateType === 'no_emd') {
            filename = 'Purchase Agreement With No EMD ( WHOLESALE).docx (3).pdf';
        } else if (templateType === 'standard') {
            filename = 'Purchase Agreement .docx.pdf';
        }

        // Load Template
        const templatePath = path.join(process.cwd(), 'public', 'templates', filename);

        // Check if exists
        try {
            await fs.access(templatePath);
        } catch (e) {
            console.error(`Template not found: ${filename}, using default.`);
            // Fallback to dummy if specific one fails, or error out?
            // Let's try the dummy as fallback to prevent crash, or error if that fails too
            try {
                const fallbackPath = path.join(process.cwd(), 'public', 'templates', 'contract_template.pdf');
                await fs.access(fallbackPath);
                // Use fallback
            } catch (e2) {
                return NextResponse.json({ error: `Template '${filename}' not found` }, { status: 404 });
            }
        }

        const pdfBuffer = await fs.readFile(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Embed Font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textSize = 12;

        // Coordinate Mapping 
        // NOTE: These match the Dummy Template. Real templates likely need adjustment.
        // The user will likely need to refine these X/Y values.
        const draw = (text: string, x: number, y: number) => {
            firstPage.drawText(text || "", { x, y, size: textSize, font, color: rgb(0, 0, 0) });
        };

        // Filled Data
        draw(data.date, 100, 700);        // Date
        draw(data.buyer, 100, 670);       // Buyer
        draw(data.seller, 100, 640);      // Seller

        draw(data.address, 50, 585);      // Address 

        draw(data.price, 160, 540);       // Price

        if (templateType !== 'no_emd') {
            draw(data.earnestMoney, 180, 480); // Earnest
        }
        draw(data.closingDate, 180, 460);  // Closing

        // Save
        const pdfBytes = await pdfDoc.save();

        // Return as binary
        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="contract_${data.seller.replace(/\s+/g, '_')}.pdf"`,
            },
        });

    } catch (error) {
        console.error("Contract Error:", error);
        return NextResponse.json({ error: "Failed to generate contract" }, { status: 500 });
    }
}
