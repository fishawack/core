module.exports = function (string, split, index, option) {
	var split = string.split(split);

	if(index === 'last'){
		index = split.length - 1;
	}

	return split[index];
};