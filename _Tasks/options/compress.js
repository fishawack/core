const { packages, capitalize } = require("../helpers/misc.js");

const compress = {};

packages
    .concat([{ name: "watertight", symlinks: true }])
    .forEach(({ name, zips = [0], symlinks = false }) => {
        zips.forEach(
            ({ cwd = `_Packages/${capitalize(name)}`, src = ["**"] }) => {
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

module.exports = {
    ...compress,
    deploy: {
        options: {
            archive: "_Zips/Deploy.zip",
            symlinks: true,
        },
        cwd: "_Packages/Deploy",
        src: ["**"],
        expand: true,
        dot: true,
    },
};
