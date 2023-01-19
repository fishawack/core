'use strict';

const expect = require('chai').expect;

describe('html', () => {
    let browser;

    before(async () => {
        const puppeteer = await import("puppeteer-core");
        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
        });
    });

    it('Should generate a index.html file', async () => {
        const page = await browser.newPage();

        await page.goto("https://lab-doc.fishawack.solutions/");

        const fullTitle = await (await page.waitForSelector("h1")).evaluate((el) => el.textContent);

        expect(fullTitle).to.equal('Lab Doc');
    });

    after(async () => {
        await browser.close();
    });
});
