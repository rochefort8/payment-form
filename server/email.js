/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const sendgrid   = require('sendgrid')(config.email.apiKey);
const email      = new sendgrid.Email();
const emailToAdmin      = new sendgrid.Email();
const emailForFeedback  = new sendgrid.Email();
const adminEmailAddress = config.admin.email;
const feedbackEmailAddress = config.admin.feedback_email;

var Email = function() {}

Email.send = function(sendTo,toWhom) {
	var from       = "tt-official@tochikukai.com";

	email.setTos(sendTo);
	email.setFrom(from);
	email.fromname = '東京東筑会';
	email.setSubject('D');
	email.setText('D');
	email.setHtml('<strong> </strong>');
        email.addSubstitution('%toWhom%', toWhom);
        email.addSubstitution('%fiscal-year%', '2018');
	email.addFilter('templates','template_id','1a518d33-e38f-472f-a5f3-451f2b658a57');

	sendgrid.send(email, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

Email.sendToAdmin = function(toWhom,email,phone,address) {
	var from       = "tt-official@tochikukai.com";

	emailToAdmin.setTos(adminEmailAddress);
	emailToAdmin.setFrom(from);
	emailToAdmin.fromname = '東京東筑会';
	emailToAdmin.setSubject('D');
	emailToAdmin.setText('D');
	emailToAdmin.setHtml('<strong> </strong>');
        emailToAdmin.addSubstitution('%toWhom%', toWhom);
        emailToAdmin.addSubstitution('%fiscal-year%', '2018');
        emailToAdmin.addSubstitution('%email%', email);
        emailToAdmin.addSubstitution('%phone%', phone);
        emailToAdmin.addSubstitution('%address%', address);

	emailToAdmin.addFilter('templates','template_id','942e816c-b270-4f19-9180-5e220c3989d0');
	sendgrid.send(emailToAdmin, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

Email.sendFeedback = function(commentFrom,rating,comment) {
    var from       = "tt-official@tochikukai.com";

    console.log('Feedback from ' + commentFrom);
    console.log('Rating='+ rating + ',Comment=' + comment);

    console.log(feedbackEmailAddress);
    
    emailForFeedback.setTos(feedbackEmailAddress);
    emailForFeedback.setFrom(from);
    emailForFeedback.fromname = '東京東筑会';
    emailForFeedback.setSubject('D');
    emailForFeedback.setText('D');
    emailForFeedback.setHtml('<strong> </strong>');
    emailForFeedback.addSubstitution('%commentFrom%', commentFrom);
    emailForFeedback.addSubstitution('%rating%', rating);
    emailForFeedback.addSubstitution('%comment%', comment);

    emailForFeedback.addFilter('templates','template_id','28e9b856-892a-45dd-b472-5b441c9684d5');
    sendgrid.send(emailForFeedback, function(err, json) {
	if (err) {
	    return console.error(err);
	}
	console.log(json);
    });
}

module.exports = Email;
