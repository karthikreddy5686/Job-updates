const pdfParse = require('pdf-parse');
console.log('default:', typeof pdfParse.default);
if(typeof pdfParse.default === 'function') {
  console.log('It is default!');
} else {
  // try to use it directly
  try {
    pdfParse(Buffer.from([]));
  } catch(e) {
    console.log('called directly error:', e.message);
  }
}
