/*
 *
 *
 *
 *
 */
var express = require('express');
var router = express.Router();

const payment = require('../server/payment');
const emailDelivery = require('../server/email');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Payment */
router.post('/charge', async (req, res, next) => {
  let {token,graduate,lastname,firstname,email} = req.body;

  var toWhom = graduate + '期:' + lastname + ' ' + firstname;

  try {
    let charge = await payment.charge(token,toWhom,email);

    /* Send Email when payment successes */
    emailDelivery.send(email,toWhom);
    return res.status(200).json({charge});
  } catch (err) {
    return res.status(500).json({type: err.type, message: err.message});
  }
});

module.exports = router;
