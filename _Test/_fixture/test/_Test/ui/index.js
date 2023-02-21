require('@fishawack/core/_Tasks/helpers/include.js')(require('grunt'), true);
const expect = require('chai').expect;

var http = require('http');

describe('index', () => {
    it('200 status code', () => {
        let status;

        browser.call(() => {
            return new Promise((resolve) => {
                http.get(`${captureEnv().url}/index.html`, res => {
                    status = res.statusCode;
                    resolve();
                });
            });
        });

        expect(status).to.be.equal(200);
    });
});