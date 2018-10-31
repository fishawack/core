var username = '';
var password = '';

if(config.targets.misc && config.targets.misc.nodemailer){
	username = config.targets.misc.nodemailer.username;
	password = config.targets.misc.nodemailer.password;	
}

module.exports = {
    options: {
        transport: require('nodemailer').createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com').transporter
    }
}