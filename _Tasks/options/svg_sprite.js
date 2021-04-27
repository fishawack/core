module.exports = {
    default: {
        expand: true,
        cwd: '.tmp/icons-min/',
        src: ['**/*.svg', '!**/__*.svg'],
        dest: '<%= src %>/handlebars/generated/',
        options: {
            mode: {
                symbol: {
                    sprite: "svgSprite.svg",
                    dest: ""
                }
            },
            svg: {
                rootAttributes: {
                    "id": "svgSprite"
                },
                xmlDeclaration : false,
                doctypeDeclaration : false,
                namespaceIDPrefix: 'svgo-'
            }
        }
    }
}