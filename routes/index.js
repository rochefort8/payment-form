var express = require('express');
var router = express.Router();

const charge = require('../server/charge');

const stripe = require('stripe')('sk_test_J98lGoxskfLVMntCGYI1b0D0');
stripe.setApiVersion('2018-02-06');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/charge', async (req, res, next) => {
  let token = req.body;	

  console.log(token);

  var charge = stripe.charges.create({
	  amount: 3000,
	  currency: "jpy",
	  card: token,
	  description: "payinguser@example.com"
      }, function(err, charge) {
	  //	  if (err && err.type === 'StripeCardError') {
	  if (err) {
	      console.log(JSON.stringify(err, null, 2));
	  }
	  res.send("completed payment!")
      });

});

module.exports = router;
