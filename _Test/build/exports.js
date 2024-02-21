const expect = require('chai').expect;

describe('captureEnv', () =>{
    let base;

    before(() => {
        base = process.cwd();
    });
    it('Should return current capture target', () => {
        require('../../_Tasks/helpers/include.js')(require('grunt'), false, 'bundle');
        expect(captureEnv().url).to.be.equal('http://localhost:9001');
    });

    after(() => {
        process.chdir(base);
    });
});