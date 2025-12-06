import { ASSIGNMENT_CONTRACT, PURCHASE_WITH_EMD, PURCHASE_WITHOUT_EMD } from './contract-templates';

interface ContractData {
    // Client data
    sellerName: string;
    seller2Name?: string;
    propertyAddress: string;
    purchasePrice: number;
    closingDate: Date;
    state: string;

    // Contract specific
    contractType: 'assignment' | 'purchase_with_emd' | 'purchase_without_emd';

    // Assignment specific
    assignee?: string;
    assignor?: string;
    finalSalesPrice?: number;
    earnestMoneyPayee?: string;
}

function numberToWords(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    function convertHundreds(n: number): string {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertHundreds(n % 100) : '');
    }

    if (num < 1000) return convertHundreds(num);
    if (num < 1000000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        return convertHundreds(thousands) + ' Thousand' + (remainder !== 0 ? ' ' + convertHundreds(remainder) : '');
    }

    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return convertHundreds(millions) + ' Million' + (remainder !== 0 ? ' ' + numberToWords(remainder) : '');
}

function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} day of ${month}, ${year}`;
}

function formatClosingDate(date: Date): string {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

export function generateContract(data: ContractData): string {
    const sellerNames = data.seller2Name
        ? `${data.sellerName} and ${data.seller2Name}`
        : data.sellerName;

    const hasSecondSeller = !!data.seller2Name;
    const secondSellerSignature = hasSecondSeller
        ? `________________________\nSeller – Print Name`
        : '';
    const secondSellerSignatureLine = hasSecondSeller
        ? `_____________________\nSeller Signature`
        : '';

    const purchasePriceWords = numberToWords(data.purchasePrice);
    const contractDate = formatDate(new Date());
    const closingDate = formatClosingDate(data.closingDate);

    let template = '';

    switch (data.contractType) {
        case 'assignment':
            const finalSalesPriceWords = numberToWords(data.finalSalesPrice || data.purchasePrice);
            const secondAssignorSignature = hasSecondSeller
                ? `Executed this day ${contractDate}. By __________________________________(Assignor)\n_______________________ (Print)`
                : '';

            template = ASSIGNMENT_CONTRACT
                .replace(/{{FINAL_SALES_PRICE_WORDS}}/g, finalSalesPriceWords)
                .replace(/{{FINAL_SALES_PRICE}}/g, (data.finalSalesPrice || data.purchasePrice).toLocaleString())
                .replace(/{{ASSIGNOR}}/g, data.assignor || 'Xyre Holdings LLC')
                .replace(/{{ASSIGNEE}}/g, data.assignee || '')
                .replace(/{{BUYER_NAME}}/g, 'Xyre Holdings LLC')
                .replace(/{{SELLER_NAMES}}/g, sellerNames)
                .replace(/{{PROPERTY_ADDRESS}}/g, data.propertyAddress)
                .replace(/{{EARNEST_MONEY_PAYEE}}/g, data.earnestMoneyPayee || '')
                .replace(/{{CLOSING_DATE}}/g, closingDate)
                .replace(/{{CONTRACT_DATE}}/g, contractDate)
                .replace(/{{SECOND_ASSIGNOR_SIGNATURE}}/g, secondAssignorSignature);
            break;

        case 'purchase_with_emd':
            template = PURCHASE_WITH_EMD
                .replace(/{{SELLER_NAMES}}/g, sellerNames)
                .replace(/{{PROPERTY_ADDRESS}}/g, data.propertyAddress)
                .replace(/{{PURCHASE_PRICE_WORDS}}/g, purchasePriceWords)
                .replace(/{{PURCHASE_PRICE}}/g, data.purchasePrice.toLocaleString())
                .replace(/{{CLOSING_DATE}}/g, closingDate)
                .replace(/{{STATE}}/g, data.state)
                .replace(/{{CONTRACT_DATE}}/g, contractDate)
                .replace(/{{SECOND_SELLER_SIGNATURE}}/g, secondSellerSignature)
                .replace(/{{SECOND_SELLER_SIGNATURE_LINE}}/g, secondSellerSignatureLine);
            break;

        case 'purchase_without_emd':
            template = PURCHASE_WITHOUT_EMD
                .replace(/{{SELLER_NAMES}}/g, sellerNames)
                .replace(/{{PROPERTY_ADDRESS}}/g, data.propertyAddress)
                .replace(/{{PURCHASE_PRICE_WORDS}}/g, purchasePriceWords)
                .replace(/{{PURCHASE_PRICE}}/g, data.purchasePrice.toLocaleString())
                .replace(/{{CLOSING_DATE}}/g, closingDate)
                .replace(/{{STATE}}/g, data.state)
                .replace(/{{CONTRACT_DATE}}/g, contractDate)
                .replace(/{{SECOND_SELLER_SIGNATURE}}/g, secondSellerSignature)
                .replace(/{{SECOND_SELLER_SIGNATURE_LINE}}/g, secondSellerSignatureLine);
            break;
    }

    return template;
}

export function generateContractHTML(contractText: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 1in;
            color: #000;
        }
        h1 {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 20px;
        }
        p {
            text-align: justify;
            margin-bottom: 12px;
        }
        .signature-line {
            margin-top: 40px;
            border-top: 1px solid #000;
            width: 300px;
        }
    </style>
</head>
<body>
    <pre style="font-family: 'Times New Roman', Times, serif; white-space: pre-wrap;">${contractText}</pre>
</body>
</html>
    `;
}
