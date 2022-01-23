/*
 *
 *
 *
 *
 */

'use strict';
require('date-utils');

const config = require('../config');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const credentials = JSON.parse(config.sheet.credentials);

var Record = function() {}      

const WORKSHEET_ID_PAYER = 0,
	WORKSHEET_ID_FEEDBACK = 1271121605 ;

Record.addPayer = function(name,graduate) {
    const sheet = new GoogleSpreadsheet(config.sheet.id);
    var date = new Date();
    var formatted = date.toFormat("YYYY/MM/DD HH24:MI");
    return this.addRaw(sheet,WORKSHEET_ID_PAYER ,{date: formatted, name: name, graduate: graduate});
}

Record.addFeedback = function(name,graduate,star,comment) {
    const sheet = new GoogleSpreadsheet(config.sheet.id);

    var date = new Date();
    var formatted = date.toFormat("YYYY/MM/DD HH24:MI");
    return this.addRaw(sheet,WORKSHEET_ID_FEEDBACK,
		       {date: formatted, name: name, graduate:graduate,
			star: star, comment:comment});
}

Record.addRaw = async function(sheet,number,data) {
	
	await sheet.useServiceAccountAuth(credentials);
	await sheet.loadInfo();
	const sheet1 = await sheet.sheetsById[number];
	if (sheet1 == undefined) {
		console.log("sheet is undefined.");
		return
	}
	await sheet1.addRow(data) ;
}

module.exports = Record;
