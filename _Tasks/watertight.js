module.exports = function(grunt) {
    grunt.registerTask('writePhp', function(){
        var watertightBridge = require('watertight');

        generateUserPasswords();
        
        grunt.file.write('_Login/app/controllers/securedsite.php', watertightBridge.buildHtmlRoutesPhp(grunt.file.expand({cwd: grunt.config.get("root")}, '*.html')));

        grunt.file.write('_Login/app/users.php', watertightBridge.buildUserPhp(deployEnv.users));

        if(deployEnv.subDir){
            grunt.file.write(
                '_Login/index.php',
                grunt.file.read('_Login/index.php').replace('<!-- appPath -->', '')
            );

            grunt.file.write(
                '_Login/index.php',
                grunt.file.read('_Login/index.php').replace('<!-- appCookie -->', (deployEnv.cookie) ? deployEnv.cookie : contentJson.attributes.title)
            );
        } else {
            grunt.file.write(
                '_Login/public_html/index.php',
                grunt.file.read('_Login/public_html/index.php').replace('<!-- appPath -->', '../')
            );

            grunt.file.write(
                '_Login/public_html/index.php',
                grunt.file.read('_Login/public_html/index.php').replace('<!-- appCookie -->', (deployEnv.cookie) ? deployEnv.cookie : contentJson.attributes.title)
            );
        }

        grunt.file.write(
            '_Login/app/app.php',
            grunt.file.read('_Login/app/app.php').replace('<!-- siteurl -->', deployUrl.replace(/\/+$/, ""))
        );

        grunt.file.write(
            '_Login/app/app.php',
            grunt.file.read('_Login/app/app.php').replace('<!-- siteTitle -->', contentJson.attributes.title)
        );

        if(deployEnv.loginType === 'style-1'){
            grunt.file.write(
                '_Login/app/views/login.php',
                grunt.file.read('_Login/app/views/login-alt.php').replace('<!-- siteLogo -->', deployEnv.logo)
            );

            grunt.file.write(
                '_Login/app/views/layout.php',
                grunt.file.read('_Login/app/views/layout-alt.php').replace('<!-- siteTitle -->', contentJson.attributes.title)
            );

            grunt.file.write(
                '_Login/app/views/forms/login.html',
                grunt.file.read('_Login/app/views/forms/login-alt.html')
            );
        }
    });

    grunt.registerTask('watertight', function(){
        var path = require('path');
        var watertightPath = path.dirname(require.resolve('watertight'));

        var copy = grunt.config.get('copy');

        if(deployEnv.subDir){
            copy['login'] = {
                files: [
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/',
                        src: ['**/*', '!composer.*', '!**/public_html/**'],
                        dest: '_Login/'
                    },
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/public_html/',
                        src: ['**/*', '**/.htaccess'],
                        dest: '_Login/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['*.html'],
                        dest: '_Login/app/views/securedsite/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*', '!*.html'],
                        dest: '_Login/'
                    }
                ]
            };
        } else {
            copy['login'] = {
                files: [
                    {
                        expand: true,
                        cwd: watertightPath + '/www/watertight/',
                        src: ['**/*', '**/.htaccess', '!composer.*'],
                        dest: '_Login/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['*.html'],
                        dest: '_Login/app/views/securedsite/'
                    },
                    {
                        expand: true,
                        cwd: '<%= root %>',
                        src: ['**/*', '!*.html'],
                        dest: '_Login/public_html/'
                    }
                ]
            };
        }

        grunt.config.set('copy', copy);

        grunt.task.run('clean:deploy', 'copy:login', 'writePhp', 'compress:watertight', 'sshexec:' + ((deployEnv.subDir) ? 'subDir' : 'root'), 'sftp:deploy', 'sshexec:unpack', 'sshexec:required');
    });
};