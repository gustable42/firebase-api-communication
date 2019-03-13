// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

//Consumer key and secret
const consumerKey    = 'ck_19e7d1809499d91bf95bf41f87443e4be0dfb606';
const consumerSecret = 'cs_2c532e09111eff0ca30727ae8bf7139d3baafdc0';

// WoocommerceAPI dependecies
const WooCommerceAPI = require('woocommerce-api');

// Connecting with Casa de Biscoitos Mineiros
const WooCommerce = new WooCommerceAPI({
  url: 'https://base.syscoin.com.br', // Your store URL
  consumerKey: consumerKey, // Your consumer key
  consumerSecret: consumerSecret, // Your consumer secret
  wpAPI: true,
  version: 'wc/v3' // WooCommerce API version
});

/**
 * @method GET
 * @param num = number of orders that will be requested
 */
exports.woocommerceOrders = functions.https.onRequest((req, res) => {
  let numOrders = 10;
  const params = req.query;

  if(typeof params.num !== 'undefined') numOrders = params.num;

  if(req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  } else {
    WooCommerce.get(`orders?per_page=${numOrders}`, (err, data, result) => {
      if(err) console.log(err.stack);
      console.log(numOrders);
      console.log(result);
    });
    return res.status(200).send('Successful connection');
  }
});

/**
 * @method GET
 * @param min = DATE YYYY-MM-DD
 * @param max = DATE YYYY-MM-DD
 */
exports.woocommerceSalesReport = functions.https.onRequest((req, res) => {
  let url;
  const params = req.query;
  let minDate = params.min;
  let maxDate = params.max;

  if(req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  } else if((typeof minDate !== 'undefined') && (typeof maxDate !== 'undefined')) {

    let minDateToCompare = new Date(minDate);
    let maxDateToCompare = new Date(maxDate);

    if(minDateToCompare <= maxDateToCompare) {

      url = `reports/sales?date_min=${minDate}&date_max=${maxDate}`;
      WooCommerce.get(url, (err, data, result) => {
        if(err) console.err(err.stack);
        console.log(result);
      });

    } else console.log('Data mínima maior que data máxima');
    return res.status(200).send('Sucessful connection');
    
  } else return res.status(400).send('Bad request');
});