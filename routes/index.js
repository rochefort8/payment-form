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
  let {token,email,graduate,fullname,fullname_kana} = req.body;

  var toWhom = graduate + '期:' + fullname ;
  var toWhom_ex = toWhom + ':' + fullname_kana;

  try {
    let charge = await payment.charge(token,toWhom_ex,email);

    /* Send Email when payment successes */
    emailDelivery.send(email,toWhom);
    return res.status(200).json({charge});
  } catch (err) {
    return res.status(500).json({type: err.type, message: err.message});
  }
});

module.exports = router;
