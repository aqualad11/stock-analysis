// AlphaService is a service for alphavantage API
const https = require('https');
require('dotenv').config();

const api_url = 'https://www.alphavantage.co/query?';
const api_key = process.env.ALPHA_KEY;

// Searchs for stocks given a keyword
exports.search = function(keywords) {
	return new Promise((resolve, reject) => {
		let func = 'SYMBOL_SEARCH';
		let url = api_url + 'function=' + func + '&keywords=' + keywords + '&apikey=' + api_key;

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

				resolve(matches);
			});
		}).on('error', (e) => {
			console.log('hit the error');
			console.log(e);
		});
	});
	
}

exports.getStockData = async function(stocks, timeSeries, timeInterval) {
	var data = {};	
	var url = '';
	// TODO: check for algorithms	
	// Check if time series is either Intraday, or any of the other
	if(timeInterval) {
		url = api_url + 'function=' + timeSeries + '&interval=' + timeInterval + '&apikey=' + api_key + '&symbol=';
	} else {
		url = api_url + 'function=' + timeSeries + '&apikey=' + api_key + '&symbol=';
	}
	console.log('url: ' + url);

	// Check if more than one stock was passed in
	if(typeof(stocks) == 'string') {
		// Extract name and key
		let stock = stocks.split('_');
		let symb = stock[0];
		let name = stock[1].replace(/-/g, ' ');
		// Get data
		let results = await callAPI(url + symb);
		// Remove meta data from results
		let key = Object.keys(results)[1];
		let new_key = name +'(' + symb +')';
		data[new_key] = results[key];

	} else {
		for(var i = 0; i < stocks.length; i++) {
			// Extract name and key
			let stock = stocks[i].split('_');
			let symb = stock[0];
			let name = stock[1].replace(/-/g, ' ');
			// Get data
			let results = await callAPI(url + symb);
			// Remove meta data from results
			let key = Object.keys(results)[1];
			let new_key = name +'(' + symb +')';
			data[new_key] = results[key];	
		}
	}

	return data;

}

// Returns promise with response from API
async function callAPI(url) {
	return new Promise((resolve, reject) => {
		// Make call to the alphavantage api
		https.get(url, (resp) => {
			let resp_data = '';

			// append data
			resp.on('data', (d) => {
				resp_data += d;
			});

			resp.on('end', () => {
				// Return response as an object
				resolve(JSON.parse(resp_data));
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
	
}

// Returns Promise which resolved returns data of stock(s)
async function getIntradayData(stocks, interval) {
	let series = 'TIME_SERIES_INTRADAY';
	let url = api_url + 'function=' + series + '&interval=' + interval + '&apikey=' + api_key + '&symbol=';
	let data = {};
	if(typeof(stocks) == 'string') {
		let results = await callAPI(url + stocks);
		let key = Object.keys(results)[1];
		data[stocks] = results[key];
		return data;
		
	} else {
		for(var i = 0; i < stocks.length; i++) {
			let stock = stocks[i];
			let results = await callAPI(url + stock);
			let key = Object.keys(results)[1];
			data[stock] = results[key];
			
		}
		return data;
	}
}

/*
function getTimeSeriesData(stocks, timeseries) {
	let url = api_url + 'function=' + timeseries + '&apikey=' + api_key + '&symbol=';
	let data = {};

	if(typeof(stocks) == 'string') {
	//	await callAPI(url + stocks);
		let key = Object.keys(results)[1];
		data[stocks] = results[key];
		return data;
	} else {
		for(var i = 0; i < stocks.length; i++) {
			let stock = stocks[i];
			let results = await callAPI(url + stock);
			let key = Object.keys(results)[1];
			data[stock] = results[key];
			
		}
		return data;
	}
}*/