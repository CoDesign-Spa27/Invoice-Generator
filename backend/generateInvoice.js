const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { toWords } = require('number-to-words'); 

function generateInvoice(data) {
  try {
    const templatePath = path.join(__dirname, 'invoiceTemplate.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateSource);

    data.items = data.items.map(item => ({
      ...item,
      discount: item.discount || 0, 
      netAmount: item.unitPrice * item.quantity - (item.discount || 0),
    }));

    const totalNetAmount = data.items.reduce((sum, item) => sum + item.netAmount, 0);
    const isSameState = data.placeOfSupply === data.placeOfDelivery;

    let taxType, taxRate, cgst, sgst, igst;
    if (isSameState) {
      taxType = 'CGST & SGST';
      taxRate = 0.09;
      cgst = totalNetAmount * taxRate;
      sgst = totalNetAmount * taxRate;
      igst = 0;
    } else {
      taxType = 'IGST';
      taxRate = 0.18;
      cgst = 0;
      sgst = 0;
      igst = totalNetAmount * taxRate;
    }

    const totalTax = cgst + sgst + igst;
    const totalAmount = totalNetAmount + totalTax;

    const derivedData = {
      ...data,
      totalNetAmount,
      taxType,
      cgst,
      sgst,
      igst,
      totalTax,
      totalAmount,
      amountInWords: toWords(totalAmount),   
    };

    if (data.signaturePath) {
      const signatureImage = fs.readFileSync(data.signaturePath);
      derivedData.signature = `data:image/png;base64,${signatureImage.toString('base64')}`;
    }
    
    return template(derivedData);
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw new Error('Failed to generate invoice');
  }
}

module.exports = { generateInvoice };
