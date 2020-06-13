var MailParser = require('mailparser').MailParser;
//var fetch = require('node-fetch');
//const http = require('http');
const request = require('request');


module.exports = {
	index: function index(req, res) {
		res.render('index.html');
		//console.dir(req.query);
		//console.log("FX server=%j",req.query.fx);
		//console.log("Quarantine ID=%j",req.query.qua);
	},

	fetch: function read(req, res) {
		var emldata;
		var mailparser = new MailParser();
		//console.dir(req.query);
		var urlquarantine=req.query.urlquarantine;
		console.log("URL quar=%j",urlquarantine);

		request(urlquarantine,function (error, response, body) {
			//console.error('error:', error); // Print the error if one occurred
			//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			//console.log('body:', body); // Print the HTML for the Google homepage.
			mailparser.on('end', function(email) {
				res.json(email);
			});
			mailparser.write(body);
			mailparser.end();
		});
	},

	read: function read(req, res) {
		var mailparser = new MailParser();
		
		if (req.files.file.mimetype == 'message/rfc822') {
                	mailparser.on('end', function(email) {
                        	res.json(email);
                       	});
                       	mailparser.write(req.files.file.buffer.toString());
               	} else {
                		res.json({ text: '', headers:{ eml_error:'eml_error' } });
                       		mailparser.write('');
		}
		
		mailparser.end();
	}
};
