module.exports = function (option) {
	var array = Array.prototype.slice.call(arguments,0);
	array.pop();
	return array;
};