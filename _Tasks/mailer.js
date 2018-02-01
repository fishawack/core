module.exports = function(grunt) {
    grunt.registerTask('mail', function() {
        if(!deployEnv.url){
            grunt.log.warn('No url for ' + deployTarget);
            return;
        }

        var nodemailer = grunt.config.get('nodemailer') || {};

        coverageString = grunt.file.read('_Build/media/generated/__coverage.svg');
        versionString = grunt.file.read('_Build/media/generated/__version.svg');

        var recipients = contentJson.attributes.email;

        switch(deployBranch){
            case 'qc':
                recipients.push('qc@fishawack.com');
            case 'master':
            case 'development':
                recipients.push('digital@f-grp.com');
                break;
            default:
                grunt.log.warn('Deployments from feature branches don\'t send emails');
                return;
        }

        nodemailer['deploy'] = {
            options: {
                recipients: recipients,
                message: {
                    from: "fishawack.auto.package@gmail.com",
                    subject: 'Auto-package: - <%= contentJson.attributes.title %>',
                    html: String.format(buildHtmlEmail('base'), 
                        [
                            buildHtmlEmail('target'),
                            buildHtmlEmail('date'),
                            buildHtmlEmail('url'),
                            (deployEnv.users) ? buildHtmlEmail('users') : '',
                            buildHtmlEmail('issues')
                        ].join(''),
                        [
                            (deployTarget === 'production') ? buildHtmlEmail('zips') : '',
                            (contentJson.attributes.electron) ? buildHtmlEmail('electron') : '',
                            (deployEnv.pdf) ? buildHtmlEmail('pdf') : ''
                        ].join(''),
                        [
                            buildHtmlEmail('version'),
                            buildHtmlEmail('coverage'),
                            buildHtmlEmail('status'),
                            buildHtmlEmail('instance'),
                            (contentJson.attributes.googleTrackingID) ? buildHtmlEmail('google') : '',
                            buildHtmlEmail('git')
                        ].join('')
                    )
                }
            }
        };

        grunt.config.set('nodemailer', nodemailer);

        grunt.task.run('gitLog', 'nodemailer');
    });
};