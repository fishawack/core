module.exports = function (json) {
	// e.g. object=type in=@root.index.content key="link" value="title"
	// object = object to perform the search against
	// in = array to search in
	// key = key of the property for each item of array
	// nestedKey = if its a nested object same as above
	// value = if not set then whole object returned, otherwise value is a key of the value you want to retrieve 
	for(var i = 0, len = json.hash.in.length; i < len; i++){
		if(json.hash.nestedKey){
			if(json.hash.in[i][json.hash.key]){
				for(var j = 0, len2 = json.hash.in[i][json.hash.key].length; j < len2; j++){
					if(json.hash.in[i][json.hash.key][j][json.hash.nestedKey] === json.hash.object){
						if(json.hash.value){
							return json.hash.in[i][json.hash.key][j][json.hash.value];	
						}
						return json.hash.in[i][json.hash.key][j];
					}
				}
			}
		} else {
			if(json.hash.in[i][json.hash.key] === json.hash.object){
				if(json.hash.value){
					return json.hash.in[i][json.hash.value];	
				}
				return json.hash.in[i];
			}
		}
	}
	return null;
};