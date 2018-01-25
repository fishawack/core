module.exports = {
	wait: {
        options: {
            delay: 5000,
            before : function(options) {
                console.log('Allowing files on server to set in place');
            }
        }
    }
}