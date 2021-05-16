const express = require('express');
const route = express.Router();
var _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');

route.get('/', (req, res) => {
  let data = req.query.address;

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
        try {
          let $ = cheerio.load(body);
          let title = $('title').text();
          console.log(title, 'TITLE');
          responseData.push(`${address[index]} - ${title}`);
        } catch (error) {
          responseData.push(`${address[index]} - No Response`);
        }
        if (index === addressArray.length - 1) {
          console.log(responseData);
          res.render('index', { data: responseData });
        }
      });
    });
  }
});

module.exports = route;
