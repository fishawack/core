module.exports = function(grunt) {
    grunt.registerTask('package', module.exports.tasks.package);
};

module.exports.packages = [
    {
        property: "pdf",
        capture: true,
        zips: []
    },
    {
        property: "app",
    },
    {
        property: "handover",
    },
    {
        property: "veeva",
        capture: true
    },
    {
        property: "cegedim",
        capture: true
    },
    {
        property: "vablet",
    },
    {
        property: "electron",
        zips: ["mac", "win"],
    },
    {
        property: "phonegap",
        zips: ["ios"],
    }
];

module.exports.tasks = {
    package() {
        const { isWatertight } = require('./helpers/include.js');
    
        const package = ['clean:zip'];
    
        const requested = module.exports.packages.filter(d => contentJson.attributes[d.property]);
    
        /* CAPTURE */
        if(requested.filter(d => d.capture).length){
            package.push('capture');
        }
    
        package.push(
            ...requested.reduce(
                (arr, b) =>
                    arr.concat(
                        [`package:${b.property}`].concat(
                            (b.zips || [b.property]).map((d) => `compress:${d}`)
                        )
                    ),
                []
            )
        );
    
        /* AUTO-PACKAGE */
        package.push('artifacts');
    
        /* WATERTIGHT */
        isWatertight(deployEnv.loginType) ? package.push('package:watertight', 'compress:watertight') : grunt.log.warn('No watertight specified');
    
        /* DEPLOY */
        deployEnv ? package.push('package:deploy') : grunt.log.warn('No deploy packaging specified');
    
        grunt.task.run(package);
    }
};