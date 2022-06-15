module.exports = function (lvalue, operator, rvalue, option) {
	lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    
    switch(operator){
    	case "+": return lvalue + rvalue;
        case "-": return lvalue - rvalue;
        case "*": return lvalue * rvalue;
        case "/": return lvalue / rvalue;
        case "%": return lvalue % rvalue;
    }   

	return 0;
};