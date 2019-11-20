const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { timeSeries, timeIntervals } = require('../data/alpha_vars');
const https = require('https');
const alpha = require('../services/alphaService');
require('dotenv').config();


// Website Home
exports.index = function(req, res, next) {
	res.render('layout', {title: 'Stock Data', timeSeries: timeSeries, timeIntervals: timeIntervals });
};

// submits form
exports.getStock = async function(req, res, next) {
	let func = req.query.timeseries;
	let interval = req.query.timeInterval;
	let outputsize = 'compact';
	let stocks = req.query.stocks;

	console.log('func = ' + func);
	console.log('interval = ' + interval);
	console.log('stocks = ');
	console.log(typeof(stocks));

	let data = await alpha.getStockData(req.query);
	console.log('time series:');
	console.log(timeSeries);
	console.log('data = ');
	console.log(data);

	//res.render('layout', {title: 'Stock Data', timeSeries: timeSeries, timeIntervals: timeIntervals });

};

exports.searchStock = function(req, res, next) {
	//console.log(sanitizeBody('*').escape());
	let keywords = req.body.input;
	alpha.search(keywords).then((matches) => {
		console.log('search matches');
		console.log(matches);
		res.send(matches);
	});
}