module.exports = function(grunt) {
    grunt.registerTask('package:watertight', ['watertight', 'writePhp']);
    
    grunt.registerTask('writePhp', function(){
        var watertightBridge = require('@fishawack/watertight');
        
        grunt.file.write('_Packages/Watertight/app/controllers/securedsite.php', watertightBridge.buildHtmlRoutesPhp(grunt.file.expand({cwd: grunt.config.get("root")}, '**/*.html')));

        if(deployEnv.users){
            grunt.file.write('_Packages/Watertight/app/users.php', watertightBridge.buildUserPhp(deployEnv.users));
        }

        var customLogin = fileExists('login.html', `${config.root}/`, grunt);
        
        var indexPath = '_Packages/Watertight/index.php';
        var appPath = '';
        var envPath = './app/views/securedsite/';
        var envSave = '_Packages/Watertight/app/views/securedsite/';
        
        if(!deployEnv.subDir){
            indexPath = '_Packages/Watertight/public_html/index.php';
            appPath = '../'
            envPath = '../';
            envSave = '_Packages/Watertight/';
        }

        grunt.file.write(`${envSave}.env`, watertightBridge.buildEnv(contentJson.attributes.env || {}));

        var indexPhp = grunt.file.read(indexPath);
        indexPhp = indexPhp.replace('<!-- appPath -->', appPath);
        indexPhp = indexPhp.replace('<!-- appCookie -->', (deployEnv.cookie) ? deployEnv.cookie : config.repo.name);
        indexPhp = indexPhp.replace('<!-- customLogin -->', customLogin);
        indexPhp = indexPhp.replace('<!-- envPath -->', envPath);

        grunt.file.write(
            indexPath,
            indexPhp
        );

        grunt.file.write(
            '_Packages/Watertight/app/app.php',
            grunt.file.read('_Packages/Watertight/app/app.php').replace('<!-- siteurl -->', deployUrl.replace(/\/+$/, ""))
        );

        grunt.file.write(
            '_Packages/Watertight/app/app.php',
            grunt.file.read('_Packages/Watertight/app/app.php').replace('<!-- siteTitle -->', contentJson.attributes.title)
        );

        grunt.file.write(
            '_Packages/Watertight/app/app.php',
            grunt.file.read('_Packages/Watertight/app/app.php').replace('<!-- singleUserExpireTime -->', deployEnv.singleUserExpireTime || '1 hour')
        );

        if(customLogin){
            grunt.file.write(
                '_Packages/Watertight/app/views/login.php',
                grunt.file.read(`${config.root}/login.html`)
            );
        }

        if(fileExists('login-form.html', `${config.root}/`, grunt)){
            grunt.file.write(
                '_Packages/Watertight/app/views/forms/login.html',
                grunt.file.read(`${config.root}/login-form.html`)
            );
        }
    });

    grunt.registerTask('watertight', function(){
        var path = require('path');
        var watertightPath = path.dirname(require.resolve('@fishawack/watertight'));

        var copy = grunt.config.get('copy');

        var ssl = (deployEnv.ssl === false) ? '.htaccess-nossl' : '.htaccess';

        if(deployEnv.subDir){
            copy['login'] = {
                files: [
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/',
                        src: ['**/*', '!composer.*', '!**/public_html/**'],
                        dest: '_Packages/Watertight/'
                    },
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/public_html/',
                        src: ['**/*'],
                        dest: '_Packages/Watertight/'
                    },
                    {
                        src: watertightPath + '/www/watertight/public_html/' + ssl,
                        dest: '_Packages/Watertight/.htaccess'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*.html'],
                        dest: '_Packages/Watertight/app/views/securedsite/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*', '!**/*.html'],
                        dest: '_Packages/Watertight/'
                    }
                ]
            };
        } else {
            copy['login'] = {
                files: [
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/',
                        src: ['**/*', '!composer.*'],
                        dest: '_Packages/Watertight/'
                    },
                    {
                        src: watertightPath + '/www/watertight/public_html/' + ssl,
                        dest: '_Packages/Watertight/public_html/.htaccess'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*.html'],
                        dest: '_Packages/Watertight/app/views/securedsite/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*', '!**/*.html'],
                        dest: '_Packages/Watertight/public_html/'
                    }
                ]
            };
        }

        grunt.config.set('copy', copy);

        grunt.task.run('clean:watertight', 'copy:login', 'clean:watertightEmptyDirs');
    });
};