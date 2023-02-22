var plugins = [
    {
        name: 'preset-default',
        params: {
            overrides: {
                "removeViewBox": false,
                "cleanupIds": false,
                "inlineStyles": false,
                "removeUselessStrokeAndFill": false
            }
        }
    },
    { 
        name: "removeDimensions"
    },
    {
        name: "prefixIds",
        params: {
            prefix: () => {
                this.counter = this.counter || 0;

                return `id-${this.counter++}`;
            }
        }
    }
];

module.exports = {
    full: {
        options: {
            plugins: plugins.concat(
                { 
                    name: "removeStyleElement" 
                },
                { 
                    name: "removeUselessStrokeAndFill" 
                },
                { 
                    name: "removeAttrs",
                    params : {
                        attrs: '(stroke|fill)'
                    }
                }
            )
        },
        expand: true,
        cwd: '.tmp/icons-fit/', // __ svg files will be left alone, all other svg files will be completely stripped
        src: ['**/*.svg', '!**/__*.svg'],
        dest: '.tmp/icons-min/'
    },
    minimal: {
        options: {
            plugins
        },
        expand: true,
        cwd: '.tmp/icons-fit/',
        src: ['**/{__,--}*.svg'],
        dest: '.tmp/icons-min/'
    }
}