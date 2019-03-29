// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
// Needed dependencies for sendEmail function
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

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
  let ordersList
  const params = req.query;

  if(typeof params.num !== 'undefined') numOrders = params.num;

  if(!isPutRequest(req)) {
    WooCommerce.get(`orders?per_page=${numOrders}`, (err, data, result) => {
      if(err) {
        console.log(err.stack);
        return res.status(401);
      } else return res.status(200).send(JSON.parse(result));
    });
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
  } else return res.status(401).send("Forbidden");
});

exports.woocommerceProductsTotals = functions.https.onRequest((req, res) => {
  if(!isPutRequest(req)) {
    WooCommerce.get('reports/products/totals', (err, data, result) => {
      if(err) console.log(err.stack);
      console.log(result);
    });
    return res.status(200).send('Successful connection');
  } else return res.status(401).send("Forbidden");
});

exports.woocommerceNewOrderNotification = functions.https.onRequest((req, res) => {
  const params = req.query;
  let id = params.id;
  console.log(id);

  if(!isPutRequest(req)) {
    WooCommerce.get(`orders/${id}`, (err, data, result) => {
      if(err) console.log(err.stack);
      console.log(result);
    });
    return res.status(200).send('Successful connection');
  } else return res.status(401).send("Forbidden");
});

/* Mailer Function  */

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'gustablegamer@gmail.com',
      pass: '52Alpacas'
  }
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const dest = req.query.dest;

    const mailOptions = {
      from: 'Gustavo Alves <gustablegamer@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
      to: dest,
      subject: 'I\'M A PICKLE!!!', // email subject
      html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
          <br />
          <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
      ` // email content in HTML
    };

    // returning result
    return transporter.sendMail(mailOptions, (err, info) => {
      if(err){
          return res.send(err.toString());
      }
      return res.send('Sended');
    });
  });
});


// Checks if the HTTP Request's method is a PUT method
const isPutRequest = req => (req.method === 'PUT') ? true : false;

// Checks if minDate is older than maxDate
const isMaxDateNewest = (minDate, maxDate) => {
  let minDateToCompare = new Date(minDate);
  let maxDateToCompare = new Date(maxDate);

  return (minDateToCompare <= maxDateToCompare) ? true : false;
}