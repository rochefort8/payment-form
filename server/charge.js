'use strict';

//const config = require('../config');
//const stripe = require('stripe')(config.stripe.secretKey);
//stripe.setApiVersion(config.stripe.apiVersion);

const createCharge = async (token) => {

    console.log(token) ;

    /*
  return await stripe.orders.create({
    currency,
    items,
    email,
    shipping,
    metadata: {
      status: 'created',
    },
  });
    */
};

exports.charge = {
    create: createCharge,
};
