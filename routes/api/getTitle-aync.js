const express = require('express');
const route = express.Router();
var _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');
var async = require('async');
route.get('/', async (req, res) => {
  let data = req.query.address;
  let count = 0;
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

    async.map(addressArray, async (role) => {
      await request(role, (error, response, role) => {
        console.log(role);
        try {
          let $ = cheerio.load(role);

          let title = $('title').text();
          console.log(title, 'TITLE');
          responseData.push(`${address[count]} - ${title}`);
        } catch (error) {
          console.log(error);
          responseData.push(`${address[count]} - No Response`);
        }
      });
      count = count + 1;
    });
  }
});

module.exports = route;
