module.exports = {
    global: {
        expand: true,
        cwd: '.tmp/icons-min/',
        src: ['**/*.svg', '!**/__*.svg'],
        dest: '_Build/handlebars/generated/',
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