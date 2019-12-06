const moment = require('moment');

exports.lineGraph = function(data) {
	var stocks = Object.keys(data);
	var labels = Object.keys(data[stocks[0]]);

	labels = reverseData(labels);

	//return;
	var dataset = [];
	for(i in stocks) {
		let label = stocks[i];
		let backgroundColor = chooseRandomColor();
		let borderColor = backgroundColor;
		let dates = data[stocks[i]];
		let points = Object.keys(dates).map((key) => {
			return dates[key]['1. open'];
		});

		points = reverseData(points);

		let set = {
			label: label,
			backgroundColor: backgroundColor,
			borderColor: borderColor,
			data: points,
			fill: false
		}
		dataset.push(set);
		console.log('points = ');
		console.log(points);
	}

	return {
		labels: labels,
		dataset: dataset
	};
}

/*
	series: [{
		values: [
			// list of stock prices
		],
		text: // stock name,
		'line-color': // color for stock,
		'legend-item': {
			'background-color': // same color as stock,
			'borderRadius': 5,
			'font-color': 'white' // for now
		},
		'legend-marker': {
			'visible': false
		},
		'marker': {
			'background-color': // same color,
			'border-width': 1,
			'shadow': 0,
			'border-color': // not sure what color to choose here, but diff than the other
		},
		'highlight': {
			'size': 6,
			'background-color': // same as the other colors
		}

	}]
*/
exports.zingLineChart = function(data) {
	var stocks = Object.keys(data);
	/*
	var dates = Object.keys(data[stocks[0]]);
	var firstDate = new moment(dates[dates.length-1]);
	firstDate = firstDate.unix();
	*/

	var series = [];
	for(i in stocks) {
		let name = stocks[i];
		let dates = data[stocks[i]];
		let values = Object.keys(dates).map((key) => {
			return [new moment(key).valueOf(), dates[key]['1. open']];
		});

		values = reverseData(values);
		console.log('values = ');
		console.log(values);
	
	}

}

function chooseRandomColor() {
	let color = '#';
	color += Math.floor(Math.random() * 16777215).toString(16);
	return color;
}

function reverseData(data) {
	let rev = [];
	for(var i = data.length-1; i >= 0; i--) {
		rev.push(data[i]);
	}

	return rev;
}