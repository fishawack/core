module.exports = function (times, option) {
	var accum = '';
    for(var i = 0; i < times; i++){
        option.data.index = i;
		option.data.first = i === 0;
    	option.data.last = i === (times - 1);
    	accum += option.fn(this);
    }
    return accum;
};