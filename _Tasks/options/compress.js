const { packages, capitalize } = require("../helpers/misc.js");

const compress = {};

packages
    .concat([
        { name: "deploy", symlinks: true },
        { name: "watertight", symlinks: true },
    ])
    .forEach(({ name, zips = [0], symlinks = false }) => {
        zips.forEach(
            ({ cwd = `_Packages/_${capitalize(name)}`, src = ["**"] }) => {
                compress[name] = {
                    options: {
                        archive: `_Zips/<%= filename %>_${capitalize(
                            name
                        )}.zip`,
                        symlinks,
                    },
                    cwd,
                    src,
                    expand: true,
                    dot: true,
                };
            }
        );
    });

module.exports = compress;
