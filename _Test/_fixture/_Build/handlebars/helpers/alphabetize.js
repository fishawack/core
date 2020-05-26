module.exports = function (value, key, option) {
	return value.sort(function(a, b) {
	    if(a[key].toLowerCase() < b[key].toLowerCase()) return -1;
	    if(a[key].toLowerCase() > b[key].toLowerCase()) return 1;
	    return 0;
	});
};