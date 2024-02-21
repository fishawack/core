var Utility = require('../../_Build/js/libs/utility.js');

describe('utility.js', function () {
    before(function(){
        fixture.setBase('_Test/unit/fixtures');
    });

    beforeEach(function(){
        fixture.load('list.html');
    });

    afterEach(function(){
        fixture.cleanup();
    });

    it('parse_query_string should split values and keys for every & sign found', function () {
        expect(Utility.parse_query_string('test=5&hello=10')).to.be.deep.equal({
        	test: '5',
        	hello: '10'
        });
    });

    it('parse_query_string should split values and keys into an array for repeat keys', function () {
        expect(Utility.parse_query_string('test=5&test=10&test=15')).to.be.deep.equal({
        	test: ['5', '10', '15']
        });
    });

    it('eachNode should iterate over list items and output correct text', function () {
    	var length = 0;
    	
        Utility.eachNode('li', function(node, i){
        	expect(node.innerText).to.be.equal('Test'+i);
        	length ++;
        });

        expect(length).to.be.equal(3);
    });
});