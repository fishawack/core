module.exports = function (option) {
  var arg = Array.prototype.slice.call(arguments,0);
  arg.pop();
  return arg.join('');
};