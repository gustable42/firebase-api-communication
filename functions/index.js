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

  if(!isPutRequest(req)) {
    WooCommerce.get(`orders?per_page=${numOrders}`, (err, data, result) => {
      if(err) console.log(err.stack);
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

  if(!isPutRequest(req) && (typeof minDate !== 'undefined') && (typeof maxDate !== 'undefined')) {

    if(isMaxDateNewest(minDate, maxDate)) {

      url = `reports/sales?date_min=${minDate}&date_max=${maxDate}`;
      WooCommerce.get(url, (err, data, result) => {
        if(err) console.err(err.stack);
        console.log(result);
      });

    } else console.log('Data mínima maior que data máxima');
    return res.status(200).send('Sucessful connection');
    
  } else return res.status(400).send('Bad request');
});

exports.woocommerceTopSellersReport = functions.https.onRequest((req, res) => {
  let url;
  const params = req.query;
  let minDate = params.min;
  let maxDate = params.max;

  if(!isPutRequest(req) && (typeof minDate !== 'undefined') && (typeof maxDate !== 'undefined')) {

    if(isMaxDateNewest(minDate, maxDate)) {

      url = `reports/top_sellers??date_min=${minDate}&date_max=${maxDate}`;
      WooCommerce.get(url, (err, data, result) => {
        if(err) console.err(err.stack);
        console.log(result);
      });

    } else console.log('Data mínima maior que data máxima');
    return res.status(200).send('Sucessful connection');
    
  } else return res.status(400).send('Bad request');
});

exports.woocommerceCustomersTotals = functions.https.onRequest((req, res) => {
  if(!isPutRequest(req)) {
    WooCommerce.get('reports/customers/totals', (err, data, result) => {
      if(err) console.log(err.stack);
      console.log(result);
    });
    return res.status(200).send('Successful connection');
  } else res.status(401).send("Forbidden");
});

exports.woocommerceOrdersTotals = functions.https.onRequest((req, res) => {
  if(!isPutRequest(req)) {
    WooCommerce.get('reports/orders/totals', (err, data, result) => {
      if(err) console.log(err.stack);
      console.log(result);
    });
    return res.status(200).send('Successful connection');
  } else res.status(401).send("Forbidden");
});


// Checks if the HTTP Request's method is a PUT method
const isPutRequest = req => (req.method === 'PUT') ? true : false;

// Checks if minDate is older than maxDate
const isMaxDateNewest = (minDate, maxDate) => {
  let minDateToCompare = new Date(minDate);
  let maxDateToCompare = new Date(maxDate);

  return (minDateToCompare <= maxDateToCompare) ? true : false;
}