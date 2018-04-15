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

var Email = function() {

}

Email.send = function(sendTo,toWhom) {
	var from       = "tt-official@tochikukai.com";

	email.setTos(sendTo);
	email.setFrom(from);
	email.fromname = '東京東筑会';
	email.setSubject('D');
	email.setText('D');
	email.setHtml('<strong> </strong>');
	email.addSubstitution('%toWhom%', toWhom)
	email.addFilter('templates','template_id','1a518d33-e38f-472f-a5f3-451f2b658a57');

	sendgrid.send(email, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

module.exports = Email;
