var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    mime = require('mime');

function mailSender(to, title, text){
    var transport = nodemailer.createTransport(
        {
            service : 'gmail',
            auth : {
            	user : 'bboyskip115@gmail.com',
            	pass : 's5327128@'
            }
        },
        {
            from : 'bboyskip115@gmail.com'
        }
    );
    
    transport.sendMail({
        to : to,
        subject : title,
        html : text
    }, function(err){
    	if(err){
    		console.log('mail send fail!!');
    	}else{
    		console.log('mail send success!!');
    	}
    });
}

module.exports = mailSender;