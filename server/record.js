/*
 *
 *
 *
 *
 */

'use strict';
require('date-utils');

const config = require('../config');
const GoogleSpreadsheet = require('google-spreadsheet');

const credentials = JSON.parse(config.sheet.credentials);

var Record = function() {}      

Record.addPayer = function(name,graduate) {
    const sheet = new GoogleSpreadsheet(config.sheet.id);
    var date = new Date();
    var formatted = date.toFormat("YYYY/MM/DD HH24:MI");
    return this.addRaw(sheet,0,{date: formatted, name: name, graduate: graduate});
}

Record.addFeedback = function(name,graduate,star,comment) {
    const sheet = new GoogleSpreadsheet(config.sheet.id);

    var date = new Date();
    var formatted = date.toFormat("YYYY/MM/DD HH24:MI");
    return this.addRaw(sheet,1,
		       {date: formatted, name: name, graduate:graduate,
			star: star, comment:comment});
}

Record.addRaw = function(sheet,number,data) {
    sheet.useServiceAccountAuth(credentials, function(err){
	if (err) {
	    console.log(err);
	    return ;
	}
	sheet.getInfo( function( err, sheet_info ){
	    if (err) {
		console.log(err);
		return ;
	    }
	    var sheet1 = sheet_info.worksheets[number];
	    if (sheet1 == null) {
		console.log('No sheet found.') ;
		return;
	    }

	
	    sheet1.addRow(data,function(err){
		if (err){
		console.log(err);
		}
	    });
	});
    })
}

module.exports = Record;
