module.exports = function(grunt) {
    grunt.registerTask('badges', function() {
        var badge = require('gh-badges');

        var done = this.async();

        issues(function(open, review){
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
                    
                    badge({ text: ["open", open], colorscheme: (open) ? 'orange' : 'green', template: "flat" }, function(svg, err) {
                        grunt.file.write('_Build/media/generated/__issues-open.svg', svg);
                        
                        badge({ text: ["under review", review], colorscheme: (open) ? 'blue' : 'green', template: "flat" }, function(svg, err) {
                            grunt.file.write('_Build/media/generated/__issues-review.svg', svg);
                            
                            done();
                        });
                    });
                });
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

function issues(cb){
    var request = require('request');

    request({
        url: "http://diggit01.fw.local/api/v4/projects/" + encodeURIComponent(contentJson.attributes.repo) + "/issues",
        headers: {
            "PRIVATE-TOKEN": "Qc9suJeXEPmiB3gDbuxX"
        }
    }, function(error, response, body){
        var open = 0;
        var review = 0;

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            
            info.forEach(function(d){
                if(d.state === 'opened'){
                    if(d.labels.indexOf('QC') === -1){
                        open += 1;
                    } else {
                        review += 1;
                    }
                }
            });
        } else {
            console.log(error);
        }

        cb(open, review);
    });
}