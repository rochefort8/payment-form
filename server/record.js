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
const sheet = new GoogleSpreadsheet(config.sheet.id);
const credentials = JSON.parse(config.sheet.credentials);

var Record = function() {}      
      
Record.set= function(name,graduate) {
    sheet.useServiceAccountAuth(credentials, function(err){
	sheet.getInfo( function( err, sheet_info ){
	    var sheet1 = sheet_info.worksheets[0];
	    var date = new Date();
	    var formatted = date.toFormat("YYYY/MM/DD HH24:MI");
	
	    sheet1.addRow( {date: formatted, name: name, graduate: graduate},function(err){
		if (err){
		console.log(err);
		}
	    });
	    if (err){
		console.log(err);
	    }
	});
    })
}

module.exports = Record;
