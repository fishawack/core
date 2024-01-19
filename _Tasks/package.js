module.exports = function (grunt) {
    grunt.registerTask("package", module.exports.tasks.package);
};

module.exports.tasks = {
    package() {
        const { packages } = require("./helpers/misc.js");
        const { isWatertight } = require("./helpers/include.js");

        const package = ["clean:zip"];

        const requested = packages.filter(
            (d) => contentJson.attributes[d.name]
        );

        /* CAPTURE */
        if (requested.filter((d) => d.capture).length) {
            package.push("capture");
        }

        package.push(
            ...requested.reduce(
                (arr, { name: packageName, zips = [{ name: packageName }] }) =>
                    arr.concat(
                        [`package:${packageName}`].concat(
                            zips.map(
                                ({ name = packageName }) => `compress:${name}`
                            )
                        )
                    ),
                []
            )
        );

        console.log(package);

        /* AUTO-PACKAGE */
        package.push("artifacts");

        /* WATERTIGHT */
        isWatertight(deployEnv.loginType)
            ? package.push("package:watertight", "compress:watertight")
            : grunt.log.warn("No watertight specified");

        /* DEPLOY */
        deployEnv
            ? package.push("package:deploy")
            : grunt.log.warn("No deploy packaging specified");

        grunt.task.run(package);
    },
};
