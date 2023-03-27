const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const fs = require('fs');

module.exports = async (pages, dest) => {
    return new Promise(async (resolve) => {
        const doc = new PDFDocument({ autoFirstPage: false });

        const out = fs.createWriteStream(dest);
        doc.pipe(out);

        for (let i = 0; i < pages.length; i++) {
            const size = await sharp(pages[i]).metadata();
            
            doc.addPage({size: [size.width, size.height]});

            doc.image(pages[i], 0, 0);
        }

        doc.end();

        out.on('finish', resolve);
    });
};