module.exports = function(grunt) {
    grunt.registerTask('writePhp', function(){
        var watertightBridge = require('watertight');

        generateUserPasswords();
        
        grunt.file.write('_Login/app/controllers/securedsite.php', watertightBridge.buildHtmlRoutesPhp(grunt.file.expand({cwd: grunt.config.get("root")}, '*.html')));

        grunt.file.write('_Login/app/users.php', watertightBridge.buildUserPhp(deployEnv.users));

        var customLogin = fileExists('login.html', '_Output/', grunt);
        
        var indexPath = '_Login/index.php';
        var appPath = '';
        
        if(!deployEnv.subDir){
            indexPath = '_Login/public_html/index.php';
            appPath = '../'
        }

        var indexPhp = grunt.file.read(indexPath);
        indexPhp = indexPhp.replace('<!-- appPath -->', appPath);
        indexPhp = indexPhp.replace('<!-- appCookie -->', (deployEnv.cookie) ? deployEnv.cookie : contentJson.attributes.title);
        indexPhp = indexPhp.replace('<!-- customLogin -->', customLogin);

        grunt.file.write(
            indexPath,
            indexPhp
        );

        grunt.file.write(
            '_Login/app/app.php',
            grunt.file.read('_Login/app/app.php').replace('<!-- siteurl -->', deployUrl.replace(/\/+$/, ""))
        );

        grunt.file.write(
            '_Login/app/app.php',
            grunt.file.read('_Login/app/app.php').replace('<!-- siteTitle -->', contentJson.attributes.title)
        );

        if(customLogin){
            grunt.file.write(
                '_Login/app/views/login.php',
                grunt.file.read('_Output/login.html')
            );
        }

        if(fileExists('login-form.html', '_Output/', grunt)){
            grunt.file.write(
                '_Login/app/views/forms/login.html',
                grunt.file.read('_Output/login-form.html')
            );
        }
    });

    grunt.registerTask('watertight', function(){
        var path = require('path');
        var watertightPath = path.dirname(require.resolve('watertight'));

        var copy = grunt.config.get('copy');

        var ssl = (deployEnv.ssl === false) ? '.htaccess-nossl' : '.htaccess';

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
                        src: ['**/*'],
                        dest: '_Login/'
                    },
                    {
                        src: watertightPath + '/www/watertight/public_html/' + ssl,
                        dest: '_Login/.htaccess'
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
                        src: ['**/*', '!composer.*'],
                        dest: '_Login/'
                    },
                    {
                        src: watertightPath + '/www/watertight/public_html/' + ssl,
                        dest: '_Login/public_html/.htaccess'
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