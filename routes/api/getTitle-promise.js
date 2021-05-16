const express = require('express');
const route = express.Router();
var _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');
var RSVP = require('rsvp');
route.get('/', (req, res) => {
  let data = req.query.address;
  let count = 1;
  if (_.isEmpty(data) || data === undefined || data === '') {
    return res.render('index', { data: ['ADDRESS IS MISSING'] });
  } else {
    let address = [];
    let addressArray = [];
    let responseData = [];
    const defaultAddressHttps = 'https://www.';
    const defaultAddressHttp = 'http://www.';

    if (typeof data === 'string') {
      address.push(data);
    } else {
      address = data;
    }

    address.map((a) => {
      a.includes(defaultAddressHttps)
        ? addressArray.push(a)
        : a.includes(defaultAddressHttp)
        ? addressArray.push(a)
        : a.includes('www.')
        ? addressArray.push(`http://${a}`)
        : addressArray.push(`${defaultAddressHttp}${a}`);
    });

    addressArray.map((add, index) => {
      request(add, (error, response, body) => {
        var promise = new RSVP.Promise((resolve, reject) => {
          if (error) {
            reject(index);
          } else {
            let $ = cheerio.load(body);

            let title = $('title').text();

            resolve(title);
          }
        });
        promise
          .then((response) => {
            responseData.push(`${address[index]} - ${response}`);
            if (addressArray.length === count) {
              console.log(count, addressArray.length);
              res.render('index', { data: responseData });
            }
            count = count + 1;
          })
          .catch((i) => {
            responseData.push(`${address[i]} - No Response`);
            if (addressArray.length === count) {
              console.log(count, addressArray.length);
              res.render('index', { data: responseData });
            }
            count = count + 1;
          });
      });
    });
  }
});

module.exports = route;
