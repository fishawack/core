module.exports = function (grunt) {
    grunt.registerTask("package:screenshots", module.exports.task);
};

module.exports.task = () => {
    const fs = require("fs-extra");
    fs.copySync(`.tmp/screenshots/`, `_Packages/Screenshots/`);
};
