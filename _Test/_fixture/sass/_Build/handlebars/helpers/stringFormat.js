module.exports = function (formattableString, json) {

  if([null, undefined, ''].indexOf(formattableString.format) > -1){
    return "Format needs providing for this string - e.g. {0} {1}";
  }

  var fixFormat = [formattableString.format];

  for(var key in formattableString){
    if (formattableString.hasOwnProperty(key)) {
      if(key !== 'format'){
        fixFormat.push(formattableString[key]);
      }
    }
  }

  return String.format.apply(null, fixFormat);
};

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String(format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    }));
  };
}