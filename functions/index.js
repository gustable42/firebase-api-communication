// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.woocommerceOrders = functions.https.onRequest((req, res) => {
  //Consumer key and secret
  const consumerKey    = 'ck_168d9297b0e0af23b5b2f7c7b76a6538f4862aee';
  const consumerSecret = 'cs_4eef81111546371d0aa9ecc9f9a8ff791cb9f3e4';

  // WoocommerceAPI dependecies
  const WooCommerceAPI = require('woocommerce-api');

  // Connecting with Casa de Biscoitos Mineiros
  const WooCommerce = new WooCommerceAPI({
    url: 'https://casadebiscoitosmineiros.com.br',
    consumerKey,
    consumerSecret,
    wpAPI: true, // Enable the WP REST API integration
    version: 'wc/v3' // WooCommerce WP REST API version
  });

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  } else {
    WooCommerce.get('orders', (err, data, result) => {
      if(err) console.log(err.stack);

      console.log(result);
      return res.status(200);
    });
  }
});