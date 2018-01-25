module.exports = {
    stripAll: {
        options: {
            plugins: [
                { removeViewBox: false, },
                { removeDimensions: true, },
                { removeStyleElement: true },
                { removeUselessStrokeAndFill: true },
                { removeAttrs: {attrs: '(stroke|fill)'} },
                {
                    cleanupIDs: {
                        prefix: {
                            toString() {
                                this.counter = this.counter || 0;

                                return `id-${this.counter++}`;
                            }
                        }
                    }
                }
            ]
        },
        expand: true,
        cwd: '.tmp/icons-fit/', // __ svg files will be left alone, all other svg files will be completely stripped
        src: ['**/*.svg', '!**/__*.svg'],
        dest: '.tmp/icons-min/'
    },
    stripAllSome: {
        options: {
            plugins: [
                { removeViewBox: false, },
                { removeDimensions: true, },
                {
                    cleanupIDs: {
                        prefix: {
                            toString() {
                                this.counter = this.counter || 0;

                                return `id-${this.counter++}`;
                            }
                        }
                    }
                }
            ]
        },
        expand: true,
        cwd: '.tmp/icons-fit/',
        src: ['**/__*.svg'],
        dest: '.tmp/icons-min/'
    },
    stripNone: {
        options: {
            plugins: [
                { removeViewBox: false, },
                { removeDimensions: true, },
                {
                    cleanupIDs: {
                        prefix: {
                            toString() {
                                this.counter = this.counter || 0;

                                return `id-${this.counter++}`;
                            }
                        }
                    }
                }
            ]
        },
        expand: true,
        cwd: '.tmp/icons-fit/',
        src: ['**/--*.svg'],
        dest: '.tmp/icons-min/'
    }
}