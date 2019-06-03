// from data.js
var data = data;
//var columns = Object.keys(data[0]);

var columns = {
	'Date' : 'Date', 
	'Home Team' : 'HomeTeam', 
	'Home Goals' : 'FTHG',
	'Home Shots' : 'HS',
	'Home Shots on Target' : 'HST',
	'Away Team' : 'AwayTeam',
	'Away Goals' : 'FTAG',
	'Away Shots' : 'AS',
	'Away Shots on Target' : 'AST',	
	'Referee' : 'Referee',
	'Winner' : 'FTR'
};

var table = d3.select('#ufo-table');
var tbody = table.select('tbody');
var thead = table.select('thead');

var formButton = d3.select('#filter-btn');
var formInput = d3.select('#datetime');
var searchInput = d3.select('#search');

//getMaxMinDates();
populateTable(data);

formInput.on("change", function(){
	filterTable(this.value);
});

searchInput.on("keydown", function(){
	if (d3.event.keyCode == 13) {
		filterTable(this.value);
	}
});

function populateTable() {
	thead.html('');
	tbody.html('');
	var headerRow = thead.append('tr');
	Object.keys(columns).forEach(function(key){
//	columns.forEach(function(key, col){
		headerRow.append('th')
			.text(key.replace(/_/g,' '))
			.classed('table-head', true);
	});
	
	for(d of data){
		makeRow(d);
	}
}

function filterTable(filterStr){
	tbody.html('');
	
	if(filterStr == ''){
		return populateTable();
	}	
	
	for(d of data){
		if( JSON.stringify(Object.values(d)).toLowerCase().indexOf(filterStr.toLowerCase()) > 0 ){
			makeRow(d);
		}
	}
	
}

function makeRow(d){
	var row = tbody.append('tr');
	var value;
	Object.keys(columns).forEach(function(key){
//	columns.forEach(function(key){
		if(key == 'Winner'){
			if(d[columns[key]] == 'D'){
				value = "Draw";
			} else if(d[columns[key]] == 'H'){
				value = d['HomeTeam'];
			} else if(d[columns[key]] == 'A'){
				value = d['AwayTeam'];
			}		
		} else {
			value = d[columns[key]];
		}
		row	
			.append('td')
			.text(value);
	});
}

function getMaxMinDates(){
	var max = new Date('0000-01-01');// = data[0]['date_string'].split(' ')[0];
	var min = new Date('9999-12-31');// = data[0]['date_string'].split(' ')[0];
	for(d of data){
		var date_only = d['date_string'].split(' ')[0];

		var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
		var dt = new Date(date_only.replace(pattern,'$3-$2-$1'));
		
		if(dt >= max){
			max = dt;
		}
		
		if(dt <= min){
			min = dt;
		}
	}
	console.log(max);
	formInput.attr("max", `${max.getFullYear()}/${max.getMonth()}/${max.getDate()}`);
	formInput.attr("min", `${min.getFullYear()}/${min.getMonth()}/${min.getDate()}`);
	return [max,min];
}