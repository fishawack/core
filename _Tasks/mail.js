module.exports = function(grunt) {
    grunt.registerTask('mail', function() {
        if(!deployEnv.url){
            grunt.log.warn('No url for ' + deployTarget);
            return;
        }

        var nodemailer = grunt.config.get('nodemailer') || {};

        var recipients = contentJson.attributes.email || [];

        if(deployBranch !== 'qc' && deployBranch !== 'development' && deployBranch !== 'master'){
            grunt.log.warn('Deployments from feature branches don\'t send emails');
        } else {
            recipients.push('digital@f-grp.com');    
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
                            (contentJson.attributes.code) ? buildHtmlEmail('code') : '',
                            (contentJson.attributes.design) ? buildHtmlEmail('design') : '',
                            (contentJson.attributes.cms) ? buildHtmlEmail('cms') : '',
                            buildHtmlEmail('url'),
                            (deployEnv.users) ? buildHtmlEmail('users') : '',
                            buildHtmlEmail('issues')
                        ].join(''),
                        [
                            (deployEnv.pdf) ? buildHtmlEmail('pdf') : '',
                            (deployTarget === 'production') ? buildHtmlEmail('zips') : ''
                        ].join(''),
                        [
                            buildHtmlEmail('version'),
                            buildHtmlEmail('coverage'),
                            buildHtmlEmail('status'),
                            buildHtmlEmail('phonegap'),
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