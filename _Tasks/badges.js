module.exports = function(grunt) {
    grunt.registerTask('badges', function() {
        var badge = require('gh-badges');

        var done = this.async();

        var pct = coverage(grunt);

        var color = 'red';

        if(pct > 80){
            color = 'green';
        } else if(pct > 60){
            color = 'yellow';
        }

        badge({ text: ["coverage", pct.toFixed(0) + '%'], colorscheme: color, template: "flat" }, function(svg, err) {
            grunt.file.write('_Build/media/generated/__coverage.svg', svg);

            badge({ text: ["version", grunt.config.get('pkg').version], colorscheme: 'blue', template: "flat" }, function(svg, err) {
                grunt.file.write('_Build/media/generated/__version.svg', svg);
                
                done();
            });
        });
    });

    grunt.registerTask('coverage', function() {
        grunt.log.writeln('Code coverage: ' + coverage(grunt).toFixed(1) + '%');
    });
};

function coverage(grunt){
    var coverage = safeLoad(grunt, 'json-summary.json', true, 'coverage/');

    var pcts = [
            (coverage.total) ? coverage.total.lines.pct : 0,
            (coverage.total) ? coverage.total.statements.pct : 0,
            (coverage.total) ? coverage.total.functions.pct : 0,
            (coverage.total) ? coverage.total.branches.pct : 0
        ];

    var pct = pcts.reduce(function(a, b){
        return a + b
    }) / pcts.length;

    return pct;
}