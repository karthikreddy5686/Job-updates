import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');

async function test() {
  try {
    // Create a dummy PDF
    const { PDFDocument } = require('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText('This is a test PDF resume text.');
    const pdfBytes = await pdfDoc.save();
    
    const buffer = Buffer.from(pdfBytes);
    console.log('Testing pdf-parse...');
    const data = await pdfParse(buffer);
    console.log('Success:', data.text);
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
