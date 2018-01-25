module.exports = function(grunt) {
    grunt.registerTask('mail', function() {
        if(!deployEnv.url){
            grunt.log.warn('No url for ' + deployTarget);
            return;
        }

        var nodemailer = grunt.config.get('nodemailer') || {};

        coverageString = grunt.file.read('_Build/media/generated/__coverage.svg');
        versionString = grunt.file.read('_Build/media/generated/__version.svg');

        contentJson.attributes.autoEmail.forEach(function(d, i){
            nodemailer[deployTarget + '-' + i] = {
                options: {
                    recipients: contentJson.attributes.autoEmail[i].recipients,
                    message: {
                        from: "fishawack.auto.package@gmail.com",
                        subject: (!d.subject) ? 'Auto-package: - <%= contentJson.attributes.title %>' : d.subject,
                        html: String.format(buildHtmlEmail('base'), 
                                String.formatKeys(d.format.join(''), 
                                    {
                                        "instance": buildHtmlEmail('instance'),
                                        "version": buildHtmlEmail('version'),
                                        "date": buildHtmlEmail('date'),
                                        "internal": (contentJson.attributes.internal && contentJson.attributes.internal.url) ? buildHtmlEmail('internal') : '',
                                        "external": (deployTarget === 'external' && contentJson.attributes.external && contentJson.attributes.external.url) ? buildHtmlEmail('external') : '',
                                        "zip": (deployTarget === 'external' && (deployEnv.ssh || deployEnv.ftp)) ? buildHtmlEmail('zips') : '',
                                        "pdf": (deployTarget === 'external' && (deployEnv.ssh || deployEnv.ftp)) ? buildHtmlEmail('pdf') : '',
                                        "googleTrackingID": (contentJson.attributes.googleTrackingID && deployTarget === 'external') ? buildHtmlEmail('google') : '',
                                        "users": (deployTarget === 'external' && contentJson.attributes.external && contentJson.attributes.external.users) ? buildHtmlEmail('users') : '',
                                        "git": buildHtmlEmail('git'),
                                        "coverage": buildHtmlEmail('coverage'),
                                        "status": buildHtmlEmail('status')
                                    }
                                )
                            )
                    }
                }
            };
        });

        grunt.config.set('nodemailer', nodemailer);

        grunt.task.run('gitLog', 'nodemailer');
    });
};