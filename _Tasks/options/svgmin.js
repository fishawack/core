var plugins = [
    {
        name: "preset-default",
        params: {
            overrides: {
                removeViewBox: false,
                cleanupIds: false,
                inlineStyles: false,
                removeUselessStrokeAndFill: false,
            },
        },
    },
    {
        name: "removeDimensions",
    },
    {
        name: "prefixIds",
        params: {
            prefix: () => {
                this.counter = this.counter || 0;

                return `id-${this.counter++}`;
            },
        },
    },
];

const full = {
    options: {
        plugins: plugins.concat(
            {
                name: "removeStyleElement",
            },
            {
                name: "removeUselessStrokeAndFill",
            },
            {
                name: "removeAttrs",
                params: {
                    attrs: "(stroke|fill)",
                },
            }
        ),
    },
    expand: true,
};

const minimal = {
    options: {
        plugins,
    },
    expand: true,
};

module.exports = {
    full: {
        ...full,
        cwd: ".tmp/icons-fit/",
        src: ["**/*.svg", "!**/{__,--}*.svg"],
        dest: ".tmp/icons-min/",
    },
    minimal: {
        ...minimal,
        cwd: ".tmp/icons-fit/",
        src: ["**/{__,--}*.svg"],
        dest: ".tmp/icons-min/",
    },
    artboard_full: {
        ...full,
        cwd: "<%= src %>",
        src: ["svg/**/*.svg", "!**/{__,--}*.svg"],
        dest: ".tmp/icons-min/",
        rename: (dest, src) =>
            `${dest}${
                require("path").parse(src).name
            }--artboard${require("path").extname(src)}`,
    },
    artboard_minimal: {
        ...minimal,
        cwd: "<%= src %>",
        src: ["svg/**/{__,--}*.svg"],
        dest: ".tmp/icons-min/",
        rename: (dest, src) =>
            `${dest}${
                require("path").parse(src).name
            }--artboard${require("path").extname(src)}`,
    },
};
