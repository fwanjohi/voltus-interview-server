const repository = require('./repository');
const logger = require('./logger');
const nodemailer = require('nodemailer');
const user = 'fxi.innovator@gmail.com';
const pwd = 'fxitester';



exports.sendEmail = function (dispatchOptions, callback) {
    //console.log('sending mail ====>', dispatchOptions);
    var transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: user,
            pass: pwd
        }
    });

    var mailOptions = {
        from: user,
        to: dispatchOptions.to,
        subject: dispatchOptions.subject,
        text: dispatchOptions.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error Sending Dispatch Email", error);
            callback(error);
        } else {
            console.log("SUCCESS", info);
            console.log('Email sent: ' + info.response);
        }
    });

}
