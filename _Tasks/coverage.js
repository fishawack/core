module.exports = function(grunt) {
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