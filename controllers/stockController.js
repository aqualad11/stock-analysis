const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { timeSeries, timeIntervals } = require('../data/alpha_vars');
const https = require('https');
const alpha = require('../services/alphaService');
const formatter = require('../services/chartFormatter');
require('dotenv').config();


// Website Home
exports.index = function(req, res, next) {
	res.render('layout', {title: 'Stock Data', timeSeries: timeSeries, timeIntervals: timeIntervals });
};

// submits form
exports.getStock = async function(req, res, next) {
	let func = req.query.timeSeries;
	let interval = req.query.timeInterval;
	let stocks = req.query.stocks;

	console.log('func = ' + func);
	console.log('interval = ' + interval);
	console.log('stocks = ');
	console.log(typeof(stocks));
	console.log('query: ');
	console.log(req.query);

	

	let data = await alpha.getStockData(req.query.stocks, req.query.timeSeries, req.query.timeInterval);
	const { labels, dataset } = formatter.lineGraph(data);

	//console.log('data = ');
	console.log(data);
	console.log('labels: ');
	console.log(labels)
	console.log('dataset: ');
	console.log(dataset);

	res.render('chart', {title: 'Stock Data', data: JSON.stringify(dataset), labels: JSON.stringify(labels), timeSeries: timeSeries, timeIntervals: timeIntervals});
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