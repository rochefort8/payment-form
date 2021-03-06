/*
 *
 *
 *
 *
 */
var express = require('express');
var router = express.Router();
const config = require('../config');
const payment = require('../server/payment');
const emailDelivery = require('../server/email');
const record = require('../server/record');

/*
 * Backup
 */
//const emailDelivery = require('../server/mailgun');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Expose the Stripe publishable key and other pieces of config via an endpoint.
router.get('/config', (req, res) => {
  res.json({
  stripePublishableKey: config.stripe.publishableKey,
  });
});

/* Test interface */
router.get('/test', (req, res) => {
    return res.json({});
});

/* Payment */
router.post('/charge', async (req, res, next) => {
	let {token,email,graduate,fullname,fullname_kana,phone,address} = req.body;

  var toWhom = graduate + '期:' + fullname ;
  var toWhom_ex = toWhom + ':' + fullname_kana;

  try {
    let charge = await payment.charge(token,toWhom_ex,email);

      /* Send Email when payment successes */
      emailDelivery.send(email,toWhom);
      emailDelivery.sendToAdmin(toWhom_ex,email,phone,address);

      /* Record this charge onto spreadsheet */
      record.addPayer(fullname,graduate);
      
    return res.status(200).json({charge});
  } catch (err) {
    return res.status(500).json({type: err.type, message: err.message});
  }
});

/* Payment */
router.post('/feedback', async (req, res, next) => {
    let {email,graduate,fullname,rating,comment} = req.body;

    var from = graduate + '期:' + fullname ;

    try {
	emailDelivery.sendFeedback(from,rating,comment);

	/* Record feedback */
	record.addFeedback(fullname,graduate,rating,comment);
	return res.status(200).json({});
    } catch (err) {
	return res.status(500).json({type: err.type, message: err.message});
    }
});
    
module.exports = router;
