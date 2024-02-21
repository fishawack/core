if (typeof define === 'function' && define.amd) {
    define([], factory);
} else if (typeof exports === 'object') {
    exports.foo = factory();
    console.log("amd ignored");
}