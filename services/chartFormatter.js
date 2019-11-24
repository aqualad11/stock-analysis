exports.lineGraph = function(data) {
	var stocks = Object.keys(data);
	var labels = Object.keys(data[stocks[0]]);
	console.log('stocks = ');
	console.log(stocks);
	console.log('labels = ');
	console.log(labels);
	console.log('random color = ' + chooseRandomColor());
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

function chooseRandomColor() {
	let color = '#';
	color += Math.floor(Math.random() * 16777215).toString(16);
	return color;
}