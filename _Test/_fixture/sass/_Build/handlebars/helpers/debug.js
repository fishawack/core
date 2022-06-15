module.exports = function (value, option) {
	var debugText = '';
	debugText += "Current Context<br>";
	debugText += "====================<br>";
	debugText += JSON.stringify(this, null, 4) + '<br>';

	if (option) {
		debugText += "Value<br>";
		debugText += "====================<br>";
		debugText += JSON.stringify(value, null, 4) + '<br>';
	}

	console.log(debugText);

	return debugText;
};