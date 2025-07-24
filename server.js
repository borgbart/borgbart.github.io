const express = require('express');
const path = require('path');
const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const bodyParser = require('body-parser');
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'BB2000')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'BB2000', 'index.html'));
});

// Utility to get the next invoice number
function getNextInvoiceNumber() {
  const counterPath = path.join(__dirname, 'invoice-counter.json');
  let counter = 1;

  if (fs.existsSync(counterPath)) {
    const data = JSON.parse(fs.readFileSync(counterPath, 'utf8'));
    counter = data.lastInvoiceNumber + 1;
  }

  fs.writeFileSync(counterPath, JSON.stringify({ lastInvoiceNumber: counter }));
  return counter;
}

app.post('/generate-quote', async (req, res) => {
  const { fullName, email, phone, quantity, variation } = req.body;

  if (!fullName || !email || !phone || !quantity || !variation) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const { productName, unitCost, vatRate } = req.body;


    const invoiceNumber = getNextInvoiceNumber();
    const currentDate = format(new Date(), 'dd/MM/yyyy');

    const netAmount = unitCost * quantity;
    const vat = netAmount * (vatRate / 100);
    const total = netAmount + vat;

    const templatePath = path.join(__dirname, 'BB2000', 'templates', 'BB2000invoice.pdf');
    const existingPdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Update coordinates as needed
    const draw = (text, x, y) => {
      page.drawText(String(text), { x, y, font, size: 10 });
    };

     // Update coordinates as needed
     const draw2 = (text, x, y) => {
        page.drawText(String(text), { x, y, font, size: 14 });
      };

    draw2(`#${invoiceNumber}`, 410, 633);
    draw2(`${currentDate}`, 410, 603);
    draw2(`Name: ${fullName}`, 75, 520);
    draw2(`Email: ${email}`, 75, 500);
    draw2(`Phone: ${phone}`, 75, 480);
    draw(`${productName}`, 77, 402);
    draw(`${quantity}`, 185, 402);
    draw(`${variation}`, 220, 402);
    draw(`€ ${unitCost.toFixed(2)}`, 346, 402);
    draw(`${vatRate} %`, 416, 402);
    draw(`€ ${total.toFixed(2)}`, 454, 402);
    draw(`€ ${netAmount.toFixed(2)}`, 454, 275);
    draw(`€ ${vat.toFixed(2)}`, 454, 250);
    draw(`€ ${total.toFixed(2)}`, 454, 225);

    const pdfBytes = await pdfDoc.save();

    const outputDir = path.join(__dirname, 'pdfs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const filename = `quote-${invoiceNumber}.pdf`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, pdfBytes);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBytes);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
