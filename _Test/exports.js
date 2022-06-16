const expect = require('chai').expect;

describe('captureEnv', () =>{
    it('Should return current capture target', () => {
        require('../_Tasks/helpers/include.js')(require('grunt'), false, 'bundle');
        expect(captureEnv().url).to.be.equal('http://localhost:9001');
    });
});