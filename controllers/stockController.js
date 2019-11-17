const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { timeSeries } = require('../data/alpha_vars');
const https = require('https');
require('dotenv').config();


var fs = require('fs');

const api_url = 'https://www.alphavantage.co/query?';
const api_key = process.env.ALPHA_KEY;

var stocks = {};

// Extract stock data
var stock_data = fs.readFileSync('./data/stock_symbols.json');
var data = JSON.parse(stock_data);

exports.index = function(req, res, next) {
	

	// returns a list of stocks with their key and value
	stocks = Object.keys(data).map(function(key) {
		return {key: key, name: data[key]};
	});

	res.render('layout', {title: 'Stock Data', stocks: stocks, timeSeries: timeSeries, results: ''});
};

exports.getStock = function(req, res, next) {
	let func = 'TIME_SERIES_INTRADAY';
	let interval = '5min';
	let outputsize = 'compact';
	let symbol = req.query.stock;
	let search = req.query.search;


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
			//console.log(data[timeseries]);
		});
	}).on('error', (e) => {
		console.error(e);
	});

};

exports.searchStock = function(req, res, next) {
	let func = 'SYMBOL_SEARCH';
	let keywords = req.body.input;
	let url = api_url + 'function=' + func + '&keywords=' + keywords + '&apikey=' + api_url;

	https.get(url, (resp) => {
		let resp_data = '';

		resp.on('data', (d) => {
			resp_data += d;
		});

		resp.on('end', function() {
			let bestmatches = 'bestMatches';
			let symbol = '1. symbol';
			let name = '2. name';
			let resp_matches = JSON.parse(resp_data)[bestmatches];
			let matches = {};
			for (var i = 0; i < resp_matches.length; i++) {
				matches[resp_matches[i][symbol]] = resp_matches[i][name];
			}
			return res.send(matches);
		});
	}).on('error', (e) => {
		console.log('hit the error');
		console.log(e);
	});
}