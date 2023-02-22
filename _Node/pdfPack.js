const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const fs = require('fs');

module.exports = async (pages, dest) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ autoFirstPage: false });

        const out = fs.createWriteStream(dest);
        doc.pipe(out);

        for (let i = 0; i < pages.length; i++) {
            let size = sizeOf(pages[i]);
            
            doc.addPage({size: [size.width, size.height]});

            doc.image(pages[i], 0, 0);
        }

        doc.end();

        out.on('finish', resolve);
    });
};