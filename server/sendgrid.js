/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const sendgrid   = require('sendgrid')('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');
const email      = new sendgrid.Email();
const emailToAdmin      = new sendgrid.Email();
const adminEmailAddress = config.admin.email;

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

module.exports = Email;
