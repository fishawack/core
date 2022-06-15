var id = 0;
module.exports = function (option) {
	if(option.hash.set != null){
		id = option.hash.set;
		return;
	}
	if(option.hash.reset){
		id = 0;
		return;
	}
	if(option.hash.repeat){
		return id;	
	}
	if(option.hash.silent){
		id++;
		return;
	}
	return id++;
};