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

exports.getStockData = async function(query) {
	var stocks_data = [];

	if(query.timeInterval) {
		return getIntradayData(query.stocks, query.timeInterval);
		
	} else {
		return getTimeSeriesData(query.stocks, query.timeseries);
	
	}
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
	let data = [];
	if(typeof(stocks) == 'string') {
		let temp = await callapi(url + stocks);
		return temp;
		/*
		callapi(url + stocks)
		.then((results) => {
			let key = Object.keys(results)[1];
			data.push(results[key]);
			console.log('intraday 1 stock data');
			console.log(results);
			return data;
		})
		.catch((err) => {
			// LOG
			return '';
		});*/
	} else {
		for(var i = 0; i < stocks.length; i++) {
			callAPI(url + stocks[i])
			.then((results) => {
				let key = Object.keys(results)[1];
				data.push(results[key]);
				if(i == stocks.length-1) { 
					console.log('intraday 1 stock data');
					console.log(results);
					return data; 
				}
			})
			.catch((err) => {
				// LOG
			});
		}
	}
}

function getTimeSeriesData(stock, timeseries) {
	return new Promise((resolve, reject) => {
		let url = api_url + 'function=' + timeseries + '&symbol=' + stock + '&apikey=' + api_key;

		https.get(url, (resp) => {
			let resp_data = '';

			resp.on('data', (d) => {
				resp_data += d;
			});

			resp.on('end', () => {
				let data = JSON.parse(resp_data);
				let key = Object.keys(data)[1];
				resolve(data[key]);
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}