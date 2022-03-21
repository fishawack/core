module.exports = function(grunt) {
    grunt.registerTask('mail', function() {        
        if(!contentJson.attributes.targets || !contentJson.attributes.targets[deployBranch]){
            grunt.log.warn(`No target config for ${deployBranch} branch`);
            return;
        }

        var username = '';
        var password = '';

        if(config.targets.misc && config.targets.misc.nodemailer){
            username = config.targets.misc.nodemailer.username;
            password = config.targets.misc.nodemailer.password; 
        } else {
            grunt.log.warn('Cannot find nodemailer credentials in ~/targets/misc.json');
            return;
        }

        var nodemailer = {
            options: {
                transport: require('nodemailer').createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com').transporter
            }
        };

        var recipients = contentJson.attributes.email || [];
        recipients = recipients.concat(deployEnv.email || []);
        recipients.push(devProject ? 'mike.mellor@fishawack.com' : 'digital@f-grp.com');

        var colors = ['red', 'blue', 'green', 'purple', '#FF5516'];
        var done = this.async();

        require('gitlog')({ 
                repo: __dirname,
                number: 5,
                fields: [ 'hash', 'subject', 'abbrevHash', 'committerName', 'committerDateRel']
            }, 
            function(error, commits) {
                for(var i = 0, len = commits.length; i < len; i++){
                    gitLogString += '<li style="color: ' + colors[i % colors.length] + ';"><b>Commit: </b>' + commits[i].abbrevHash + '<ul style="color: black;">';

                    gitLogString += '<li><strong>Name</strong>: ' + commits[i].committerName + '</li>';
                    gitLogString += '<li><strong>Date</strong>: ' + commits[i].committerDateRel + '</li>';
                    gitLogString += '<li><strong>Message</strong>: ' + commits[i].subject + '</li>';

                    gitLogString += '</ul></li>';
                }

                let html = String.format(buildHtmlEmail('base'), 
                    [
                        buildHtmlEmail('target'),
                        buildHtmlEmail('date'),
                        (contentJson.attributes.code) ? buildHtmlEmail('code') : '',
                        (contentJson.attributes.design) ? buildHtmlEmail('design') : '',
                        (contentJson.attributes.cms) ? buildHtmlEmail('cms') : '',
                        (deployEnv.url) ? buildHtmlEmail('url') : '',
                        (deployEnv.users) ? buildHtmlEmail('users') : ''
                    ].join(''),
                    [
                        (contentJson.attributes.pdf) ? buildHtmlEmail('pdf') : '',
                        buildHtmlEmail('zips')
                    ].join(''),
                    [
                        buildHtmlEmail('version'),
                        buildHtmlEmail('coverage'),
                        (contentJson.attributes.pdf) ? buildHtmlEmail('diff') : '',
                        buildHtmlEmail('status'),
                        (contentJson.attributes.phonegap) ? buildHtmlEmail('phonegap') : '',
                        buildHtmlEmail('instance'),
                        (contentJson.attributes.googleTrackingID) ? buildHtmlEmail('google') : '',
                        buildHtmlEmail('git')
                    ].join('')
                );

                nodemailer['deploy'] = {
                    options: {
                        recipients: recipients,
                        message: {
                            from: "fishawack.auto.package@gmail.com",
                            subject: 'Auto-package: - <%= repo.name %>',
                            html
                        }
                    }
                };

                grunt.config.set('nodemailer', nodemailer);

                if(devProject){
                    const fs = require('fs-extra');
                    let logPath = path.join(process.cwd(), '.tmp/email/', 'log.html');
                    console.log(`Logging mail to ${logPath}`);
                    fs.mkdirpSync(path.dirname(logPath));
                    fs.writeFileSync(logPath, html);
                } else {
                    grunt.task.run('nodemailer');
                }

                done();
            }
        );
    });
};