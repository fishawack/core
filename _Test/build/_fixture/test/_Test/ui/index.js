const expect = require('chai').expect;
const http = require('http');

describe('index', () => {
    it('200 status code', async () => {
        let res = await new Promise(resolve => http.get(`${browser.requestedCapabilities.url}/index.html`, resolve));
        
        expect(res.statusCode).to.be.equal(200);
    });
});