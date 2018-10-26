var username = config.targets.misc.nodemailer.username;
var password = config.targets.misc.nodemailer.password;

module.exports = {
    options: {
        transport: require('nodemailer').createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com').transporter
    }
}