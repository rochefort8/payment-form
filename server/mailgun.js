/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const apiKey = config.email.apiKey;
const domain = 'sandboxa1d8ed7105c14aec90268d0af5f93b8e.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey, domain })

const adminEmailAddress = config.admin.email;



const mail_body = 'この度は、東京東筑会の2018年度年会費を納入いただきまして誠にありがとうございます。\n' +
'東京東筑会では、卒業生の世代を超えた交流を目的とした懇親会や各種イベントを主催しております。\n' +
'詳細は随時「東京東筑会ホームページ」に記載しておりますので、是非ともご覧ください。\n' +
'\n' +
'東京東筑会ホームページ\n' +
'https://tochikukai.com/\n' +
'\n' +
'懇親会、イベントへの参加をお待ちしております！\n' +
'\n' +
'-------------------------------------\n' +
'東京東筑会・事務局\n' +
'連絡先 : tt-official@tochikukai.com\n' +
'-------------------------------------';

var Email = function() {}

Email.send = function(sendTo,toWhom) {

    const data = {
	from: '東京東筑会 <tt-official@tochikukai.com>',
	to: sendTo,
	subject: '[東京東筑会] 年会費支払いのご連絡',
	text: toWhom + '様\n\n' + mail_body
    }
    console.log(data.text);

    mailgun.messages().send(data, (err, body) => {
	    if (err) { return console.error(err) }
	    console.log(body)
	})
}

Email.sendToAdmin = function(toWhom,email,phone,address) {

}

module.exports = Email;
