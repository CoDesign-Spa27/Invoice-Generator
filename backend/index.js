const express = require('express');
const cors = require('cors');
const { generateInvoice } = require('./generateInvoice');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.post('/generate-invoice', (req, res) => {
  try {
    const invoiceData = req.body;
    validateInvoiceData(invoiceData);
    const invoiceHtml = generateInvoice(invoiceData);
    res.json({ invoiceHtml });
  } catch (error) {
    console.error('Error processing invoice:', error);
    res.status(400).json({ error: error.message });
  }
});

function validateInvoiceData(data) {
  const requiredFields = [
    'sellerName', 'sellerAddress', 'sellerCity', 'sellerState', 'sellerPincode',
    'sellerPAN', 'sellerGST', 'placeOfSupply', 'billingName', 'billingAddress',
    'billingCity', 'billingState', 'billingPincode', 'billingStateCode','shippingName',
    'shippingAddress','shippingCity','shippingState','shippingPincode','shippingStateCode',
    'placeOfDelivery', 'orderNo', 'orderDate', 'invoiceNo', 'invoiceDate', 'items'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Items must be a non-empty array');
  }

 
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
