function url_join() {
    return new URL(require('path').join(...[].slice.call(arguments, 1)), arguments[0]).toString();
};

module.exports = {
    url_join
}