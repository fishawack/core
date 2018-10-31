var token = '';

if(config.targets.misc && config.targets.misc.gitlab){
    token = config.targets.misc.gitlab.token;
}

module.exports = function(grunt) {
    grunt.registerTask('badges', function() {
        var async = require('async');
        var badge = require('gh-badges');
        var svg_to_png = require('svg-to-png');

        var done = this.async();

        issues(function(open, review){
            var pct = coverage(grunt);

            var color = 'red';

            if(pct > 80){
                color = 'green';
            } else if(pct > 60){
                color = 'yellow';
            }

            function buildBadge(text, value, colorscheme, file, cb){
                badge({ text: [text, value], colorscheme: colorscheme, template: "flat" }, function(svg, err) {
                    grunt.file.write('_Build/media/generated/__' + file + '.svg', svg);
                    cb(null, process.cwd() + '/_Build/media/generated/__' + file + '.svg');
                });
            }

            async.parallel([
                async.apply(buildBadge, " coverage ", pct.toFixed(0) + '%', color, 'coverage'),
                async.apply(buildBadge, " version ", grunt.config.get('pkg').version, 'blue', 'version'),
                async.apply(buildBadge, " open ", "  " + open + "  ", (open) ? 'orange' : 'green', 'issues-open'),
                async.apply(buildBadge, " under review ", "  " + review + "  ", (review) ? 'blue' : 'green', 'issues-review')
            ], function(err, results){
                if(process.env.NODE_ENV === 'development'){
                    done();
                } else {
                    svg_to_png.convert(results, '_Build/media/generated/').then(function(){
                        done();
                    });
                }
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
            "PRIVATE-TOKEN": token
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