module.exports = function (value, delimiter, split, option) {
	if(typeof value === 'string'){
		value = value.split(split);
	}

	return value.join(delimiter);
};