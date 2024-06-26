module.exports = function(grunt) {
    grunt.registerTask('mail', function() {        
        if(!contentJson.attributes.targets || !contentJson.attributes.targets[deployBranch]){
            grunt.log.warn(`No target config for ${deployBranch} branch`);
            return;
        }

        const { nodemailer } = config.targets.misc || {};
        const { driver, from } = nodemailer;
        const mailer = nodemailer[driver] || nodemailer;

        if(!mailer){
            grunt.log.warn('Cannot find nodemailer credentials in ~/targets/misc.json');
            return;
        }

        const { username, password, host } = mailer;

        var recipients = contentJson.attributes.email || [];
        recipients = recipients.concat(deployEnv.email || []);
        recipients.push(devProject ? 'mike.mellor@fishawack.com' : 'digital@f-grp.com');

        var colors = ['red', 'blue', 'green', 'purple', '#FF5516'];
        var done = this.async();

        require('gitlog').default({ 
                repo: __dirname,
                number: 5,
                fields: [ 'hash', 'subject', 'abbrevHash', 'committerName', 'committerDateRel']
            }, 
            async function(error, commits) {
                for(var i = 0, len = commits.length; i < len; i++){
                    gitLogString += '<li style="color: ' + colors[i % colors.length] + ';"><b>Commit: </b>' + commits[i].abbrevHash + '<ul style="color: black;">';

                    gitLogString += '<li><strong>Name</strong>: ' + commits[i].committerName + '</li>';
                    gitLogString += '<li><strong>Date</strong>: ' + commits[i].committerDateRel + '</li>';
                    gitLogString += '<li><strong>Message</strong>: ' + commits[i].subject + '</li>';

                    gitLogString += '</ul></li>';
                }

                const { packages, capitalize } = require("./helpers/misc.js");
                const requested = packages.filter(
                    (d) => contentJson.attributes[d.name] && (d.zips?.length || d.zips == null)
                );

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
                        buildHtmlEmail('zips', {html: requested.reduce(function(html, b){
                            var filename = `${config.filename}_${capitalize(b.name)}.zip`; 
                            var ext = encodeURI(`https://fishawack.egnyte.com/app/index.do#storage/files/1/Shared/FW/Knutsford/Digital/Auto-Package/${config.pkg.name}`);
                            var raw = getFilesizeInBytes("_Zips/" + filename);
        
                            var name = '<strong>' + capitalize(b.name) + '</strong>:';
                            var url = '<li><a href="' + ext + '">' + filename + '</a></li>';
                            var size = '<li><strong>Size</strong>: ' + raw + '</li>';
        
                            return html += '<li>' + name + '<ul>' + url + size + '</ul></li>';
                        }, '')})
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

                if(devProject === "mail"){
                    const fs = require('fs-extra');
                    let logPath = path.join(process.cwd(), '.tmp/mail/', 'log.html');
                    console.log(`Logging mail to ${logPath}`);
                    fs.mkdirpSync(path.dirname(logPath));
                    fs.writeFileSync(logPath, html);
                } else {
                    await module.exports.sendMail(username, password, host, recipients, from, `Auto-package: - ${config.repo.name}`, html);
                }

                done();
            }
        );
    });
};

module.exports.sendMail = async (username, password, host, recipients, from, subject, html) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        host,
        port: 587,
        requireTLS: true,
        auth: {
            user: username,
            pass: password
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from,
        to: recipients.join(', '),
        subject,
        html
    });
};