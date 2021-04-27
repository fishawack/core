module.exports = {
    dist: {
        "dest" : "<%= src %>/js/generated/__modernizr-custom.js",
        "tests": contentJson.attributes.modernizr || [],
        "options": [
            "html5shiv",
            "setClasses"
        ],
        "uglify": true,
        "crawl" : false
    }
}