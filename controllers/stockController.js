const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { timeSeries } = require('../data/alpha_vars');
const https = require('https');
require('dotenv').config();


var fs = require('fs');

const api_url = 'https://www.alphavantage.co/query?';
const api_key = process.env.ALPHA_KEY;


exports.index = function(req, res, next) {
	var stock_data = fs.readFileSync('./data/stock_symbols.json');
	let data = JSON.parse(stock_data);

	// returns a list of stocks with their key and value
	let stocks = Object.keys(data).map(function(key) {
		return {key: key, name: data[key]};
	});

	res.render('layout', {title: 'Stock Data', stocks: stocks, timeSeries: timeSeries});
};

exports.getStock = function(req, res, next) {
	let func = 'TIME_SERIES_INTRADAY';
	console.log('timeseries = ' + req.query.timeseries);
	let interval = '5min';
	let outputsize = 'compact';
	let symbol = req.query.stock;

	// API url for alphavantage
	let url = api_url + 'function=' + func + '&symbol=' + symbol + '&interval=' + interval + '&apikey=' + api_url;
	
	https.get(url, (resp) => {
		let resp_data = '';

		resp.on('data', (d) => {
			resp_data += d;
		});

		resp.on('end', function() {
			let timeseries = 'Time Series (' + interval + ')';
			let data = JSON.parse(resp_data);
			//let stock_data = Object.keys(data).map(function(key))
			console.log(data[timeseries]);
		});
	}).on('error', (e) => {
		console.error(e);
	});

};