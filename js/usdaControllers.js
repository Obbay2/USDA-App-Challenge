var USDAControllers = angular.module('usdaControllers', [
'mm.foundation',
'ngMap',
'chart.js',
'ngAnimate',
'nwHelper'
]);

USDAControllers.controller('HomeCtrl', ['$scope', '$q', '$http', '$timeout', 'stateService', 'mathService', 'locationService', 'dataService', function ($scope, $q, $http, $timeout, stateService, mathService, locationService, dataService) {
	
	//Lower points is better
	
	var firstExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "EXPENSES",
		commodity_desc: "RENT",
		class_desc: "CASH%2C%20CROPLAND",
		prodn_practice_desc: "IRRIGATED",
		year: ""
	};
	
	var secondExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "EXPENSES",
		commodity_desc: "RENT",
		class_desc: "CASH%2C%20CROPLAND",
		prodn_practice_desc: "NON-IRRIGATED",
		year: ""
	};
	
	var thirdExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "EXPENSES",
		commodity_desc: "RENT",
		class_desc: "CASH%2C%20PASTURELAND",
		year: ""
	};
	
	var fourthExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "EXPENSES",
		commodity_desc: "EXPENSE%20TOTALS",
		class_desc: "PRODUCTION",
		unit_desc: "$",
		year: ""
	};
	
	var fifthExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "PRICES%20PAID",
		commodity_desc: "RENT",
		class_desc: "PER%20COW-CALF",
		year: ""
	};
	
	var sixthExpense = {
		sector_desc: "ECONOMICS",
		group_desc: "PRICES%20PAID",
		commodity_desc: "RENT",
		class_desc: "PER%20HEAD",
		year: ""
	};
	
	var firstIncome = {
		sector_desc: "ECONOMICS",
		group_desc: "INCOME",
		commodity_desc: "INCOME%2C%20FARM-RELATED",
		class_desc: "FOREST%20PRODUCTS%2C%20(EXCL%20CHRISTMAS%20TREES%20%26%20SHORT%20TERM%20WOODY%20CROPS%20%26%20MAPLE%20SYRUP)",
		domain_desc: "TOTAL",
		unit_desc: "$",
		year: ""
	};
	
	var secondIncome = {
		sector_desc: "ECONOMICS",
		group_desc: "INCOME",
		commodity_desc: "INCOME%2C%20FARM-RELATED",
		class_desc: "AG%20TOURISM%20%26%20RECREATIONAL%20SERVICES",
		domain_desc: "TOTAL",
		unit_desc: "$",
		year: ""
	};
	
	var thirdIncome = {
		sector_desc: "ECONOMICS",
		group_desc: "INCOME",
		commodity_desc: "INCOME%2C%20FARM-RELATED",
		class_desc: "GOVT%20PROGRAMS%2C%20STATE%20%26%20LOCAL",
		domain_desc: "TOTAL",
		unit_desc: "$",
		year: ""
	};
	
	var fourthIncome = {
		sector_desc: "ECONOMICS",
		group_desc: "INCOME",
		commodity_desc: "INCOME%2C%20FARM-RELATED",
		class_desc: "PATRONAGE%20DIVIDENDS%20%26%20REFUNDS%20FROM%20COOPERATIVES",
		domain_desc: "TOTAL",
		unit_desc: "$",
		year: ""
	};
	
	var fifthIncome = {
		sector_desc: "ECONOMICS",
		group_desc: "INCOME",
		commodity_desc: "GOVT%20PROGRAMS",
		class_desc: "FEDERAL",
		domain_desc: "TOTAL",
		unit_desc: "$",
		year: ""
	};
	
	$scope.sets = {
		expenses: {
			selected: 'Expenses',
			sets: 6,
			startingYear: 1999,
			years: 15,
			scoreDesc: 'A lower score means that a state is less expensive for farming. Land is cheaper to buy, livestock is cheaper to maintain, and general expenses are low.',
			accuracyDesc: ''
		},
		income: {
			selected: 'Income',
			sets: 5,
			startingYear: 1999,
			years: 15,
			scoreDesc: 'A higher score means that a state earns more income in the agricultural district. More income is made from tourism, selling of christmas trees, etc.',
			accuracyDesc: ''
		}
	};
	
	$scope.contextualInformation = null;
	
	$scope.loading = false;
	
	$scope.states = [];
	$scope.stateSelected = false;
	
	//For list sorting
	$scope.sortType = 'rank';
	$scope.sortReverse = false;
	$scope.max = 0;
	
	$scope.selectedSetData = [];
	$scope.empties = 0;
	
	//State specific
	$scope.charts = [];
	$scope.selectedState = "";
	$scope.selectedStateData = [];
	$scope.stateDescription = "";
	$scope.descriptionReference = "";
	$scope.stateImageOne = "";
	$scope.stateImageTwo = "";
	var mapOne = null;
	var mapTwo = null;
	$scope.stateMarker = {};
	
	var reset = function(){
		stateService.resetStates();
		$scope.states = [];
		$scope.stateSelected = false;
		$scope.sortType = 'rank';
		$scope.sortReverse = false;
		$scope.max = 0;
		$scope.selectedSetData = [];
		$scope.empties = 0;
	};
	
	$scope.compileEconomicExpenseData = function(){
		var promiseArray = [];
		
		reset();
		$scope.loading = dataService.toggleLoading();
		dataService.setYear($scope.years);
		$scope.sets.expenses.accuracyDesc = 'Compiled from ' + $scope.sets.expenses.sets + ' data sets over ' + $scope.sets.expenses.years + ' years. Less accuracy means less data was collected over the time period for that state.'
		$scope.contextualInformation = $scope.sets.expenses;
		
		var states = stateService.getStates();
		
		promiseArray.push(compileData(firstExpense));
		promiseArray.push(compileData(secondExpense));
		promiseArray.push(compileData(thirdExpense));
		promiseArray.push(compileData(fourthExpense));		
		promiseArray.push(compileData(fifthExpense));
		promiseArray.push(compileData(sixthExpense));
		
		$q.all(promiseArray).then(function(dataSets){
			//console.log(dataSets);
			for(var i = 0; i < dataSets.length; i++){
				for(var j = 0; j < dataSets[i].length; j++){
					for(var k = 0; k < dataSets[i][j].data.length; k++){
						var stateName = dataSets[i][j].data[k].state_name.toLowerCase().replace(" ", "_");
						dataService.trackData(stateName, dataSets[i][j]);
						dataService.addHit(stateName);
						states[stateName].points += dataSets[i][j].data[k].points;
						states[stateName].data ++;
					}
					dataService.addPointsReset(dataSets[i][j].data.length);
				}
				dataService.resetTrackData();
			}
			$scope.selectedSetData = dataSets;
			console.log($scope.selectedSetData);
			
			for(var i = 0; i < dataSets.length; i++){
				$scope.max += dataSets[i].length;
			}
			
			var keys = Object.keys(states);
			
			for(var i = 0; i < keys.length; i++){
				states[keys[i]]["state"] = keys[i];
				$scope.states.push(states[keys[i]]);
			}
			
			mathService.sortArrayAscending($scope.states);
			
			for(var i = 0; i < $scope.states.length; i++){
				$scope.states[i]["rank"] = i + 1;
			}
			
			$scope.loading = dataService.toggleLoading();
		});
	};
	
	$scope.compileEconomicIncomeData = function(){
		var promiseArray = [];
		
		reset();
		$scope.loading = dataService.toggleLoading();
		dataService.setYear($scope.years);
		
		$scope.sets.income.accuracyDesc = 'Compiled from ' + $scope.sets.income.sets + ' data sets over ' + $scope.sets.income.years + ' years. Less accuracy means less data was collected over the time period for that state.'
		$scope.contextualInformation = $scope.sets.income;
		
		var states = stateService.getStates();
		
		promiseArray.push(compileData(firstIncome));
		promiseArray.push(compileData(secondIncome));
		promiseArray.push(compileData(thirdIncome));
		promiseArray.push(compileData(fourthIncome));		
		promiseArray.push(compileData(fifthIncome));
		//promiseArray.push(compileData(sixthExpense));
		
		$q.all(promiseArray).then(function(dataSets){
			//console.log(dataSets);
			for(var i = 0; i < dataSets.length; i++){
				for(var j = 0; j < dataSets[i].length; j++){
					for(var k = 0; k < dataSets[i][j].data.length; k++){
						var stateName = dataSets[i][j].data[k].state_name.toLowerCase().replace(" ", "_");
						dataService.trackData(stateName, dataSets[i][j]);
						dataService.addHit(stateName);
						states[stateName].points += dataSets[i][j].data[k].points;
						states[stateName].data ++;
					}
					//console.log(states);
					dataService.addPointsReset(dataSets[i][j].data.length);
					//console.log(states);
				}
				dataService.resetTrackData();
			}
			$scope.selectedSetData = dataSets;
			//console.log($scope.selectedSetData);
			
			for(var i = 0; i < dataSets.length; i++){
				$scope.max += dataSets[i].length;
			}
			
			var keys = Object.keys(states);
			
			for(var i = 0; i < keys.length; i++){
				states[keys[i]]["state"] = keys[i];
				$scope.states.push(states[keys[i]]);
			}
			
			mathService.sortArrayDescending($scope.states);
			
			for(var i = 0; i < $scope.states.length; i++){
				$scope.states[i]["rank"] = i + 1;
			}
			
			mathService.sortArrayAscending($scope.states);
			
			$scope.loading = dataService.toggleLoading();

		});
	};
	
	var compileData = function(optionArray){
		var promiseArray = [];
		var deferred = $q.defer();
		
		for(var i = $scope.contextualInformation.startingYear; i < $scope.contextualInformation.startingYear + $scope.contextualInformation.years; i++){
			optionArray.year = i;
			promiseArray.push(stateService.getStateData(optionArray));
		}
		
		$q.all(promiseArray).then(function(dataObject){
			
			$scope.empties = dataService.removeEmpties(dataObject);
			
			for(var i = 0; i < dataObject.length; i++){
				dataService.removeBadData(dataObject[i]);
				dataService.removeComma(dataObject[i]);
				dataService.addAverage(dataObject[i], mathService.getAverage(dataObject[i]));
				dataService.reduceValue(dataObject[i]);
				mathService.sortData(dataObject[i]);
				
				dataService.addPoints(dataObject[i]); //Must go last
			}

			deferred.resolve(dataObject);
			
		});
		
		return deferred.promise;
	};
	
	$scope.showStateData = function(state){
		
		$scope.loading = dataService.toggleLoading();
		$scope.selectedState = state;
		$scope.stateSelected = true;
		setData(state);
		
		if($scope.contextualInformation.selected === 'Expenses'){
			
			var chart = {
				title: "",
				desc: "",
				unit: "",
				colors: ['#0000A0', '#FF7400'],
				labels: [],
				series: [],
				data: [[],[]],
				options: {
					scaleShowVerticalLines: false
				}
			}
			
			for(var i = 0; i < $scope.selectedSetData.length; i++){ //Each dataSet
			
				chart.series.push(state.toUpperCase().replace("_", " "));
				chart.series.push('US AVERAGE');
				
				var unit = null;
				var object = null;
				
				//console.log($scope.selectedSetData[i]);
				
				for(var j = 0; j < $scope.selectedSetData[i].length; j++){ //Each year
				
					var year = null;
					var value = null;
					var average = null;
					var flag = false;
					
					//console.log("here");
					
					for(var k = 0; k < $scope.selectedSetData[i][j].data.length; k++){ //Each state data point
						var stateName = $scope.selectedSetData[i][j].data[k].state_name.toLowerCase().replace(" ", "_");
						if(state === stateName){
							//$scope.selectedStateData.push($scope.selectedSetData[i][j].data[k]);
							object = $scope.selectedSetData[i][j].data[k];
							
							flag = true;
							
							//console.log($scope.selectedSetData[i][j].data[k]);
							
							year = $scope.selectedSetData[i][j].data[k].year;
							value = $scope.selectedSetData[i][j].data[k].value;
							average = $scope.selectedSetData[i][j].data[k].average;
							
							unit = $scope.selectedSetData[i][j].data[k].unit_desc;
							
							break;
						}
					}
					
					if(flag){
						chart.labels.push(year);
						chart.data[0].push(value);
						chart.data[1].push(average);
					}
							
				}
				
				if(chart.labels.length !== 0){
					chart.unit = unit;
					setTitleDesc(chart, object);
					console.log(chart);
					$scope.charts.push(chart);
				}	
				chart = {
					title: "",
					desc: "",
					unit: "",
					colors: ['#0000A0', '#FF7400'],
					labels: [],
					series: [],
					data: [[],[]],
					options: {
						scaleShowVerticalLines: false
					}
				};
				
			}
			
		}else if($scope.contextualInformation.selected === 'Income'){
			var chart = {
				title: "",
				desc: "",
				unit: "",
				colors: ['#0000A0', '#FF7400'],
				labels: [],
				series: [],
				data: [[],[]],
				options: {
					scaleShowVerticalLines: false
				}
			}
			
			for(var i = 0; i < $scope.selectedSetData.length; i++){ //Each dataSet
			
				chart.series.push(state.toUpperCase().replace("_", " "));
				chart.series.push('US AVERAGE');
				
				var unit = null;
				var object = null;
				
				//console.log($scope.selectedSetData[i]);
				
				for(var j = 0; j < $scope.selectedSetData[i].length; j++){ //Each year
				
					var year = null;
					var value = null;
					var average = null;
					var flag = false;
					
					//console.log("here");
					
					for(var k = 0; k < $scope.selectedSetData[i][j].data.length; k++){ //Each state data point
						var stateName = $scope.selectedSetData[i][j].data[k].state_name.toLowerCase().replace(" ", "_");
						if(state === stateName){
							//$scope.selectedStateData.push($scope.selectedSetData[i][j].data[k]);
							object = $scope.selectedSetData[i][j].data[k];
							
							flag = true;
							
							//console.log($scope.selectedSetData[i][j].data[k]);
							
							year = $scope.selectedSetData[i][j].data[k].year;
							value = $scope.selectedSetData[i][j].data[k].value;
							average = $scope.selectedSetData[i][j].data[k].average;
							
							unit = $scope.selectedSetData[i][j].data[k].unit_desc;
							
							break;
						}
					}
					
					if(flag){
						chart.labels.push(year);
						chart.data[0].push(value);
						chart.data[1].push(average);
					}
							
				}
				
				if(chart.labels.length !== 0){
					chart.unit = unit;
					setTitleDesc(chart, object);
					//console.log(chart);
					$scope.charts.push(chart);
				}	
				chart = {
					title: "",
					desc: "",
					unit: "",
					colors: ['#0000A0', '#FF7400'],
					labels: [],
					series: [],
					data: [[],[]],
					options: {
						scaleShowVerticalLines: false
					}
				};
				
			}
		}
	};
	
	$scope.hideStateData = function(){
		$scope.stateSelected = false;
		$scope.charts = [];
		$scope.selectedState = "";
		$scope.selectedStateData = [];
		$scope.stateDescription = "";
		$scope.descriptionReference = "";
		$scope.stateImageOne = "";
		$scope.stateImageTwo = "";
		$scope.stateMarker = {};
	};
	
	var setTitleDesc = function(chart, object){
		
		if($scope.contextualInformation.selected === "Expenses"){
			if(object.class_desc === 'CASH, CROPLAND'){
				if(object.prodn_practice_desc === 'IRRIGATED'){
					chart.title = 'Cost of One Irrigated Farmland Acre per Month';
					chart.desc = 'This is the cost to maintain and operate one acre of irrigated farmland per month. Even if the land is owned a lower number means that the land is cheaper.';
				}else if(object.prodn_practice_desc === 'NON-IRRIGATED'){
					chart.title = 'Cost of One Non-Irrigated Farmland Acre per Month';
					chart.desc = 'This is the cost to maintain and operate one acre of non-irrigated farmland per month. Even if the land is owned a lower number means that the land is cheaper.';
				}
			}else if(object.class_desc === 'CASH, PASTURELAND'){
				chart.title = 'Cost of One Pastureland Acre per Month';
				chart.desc = 'This is the cost to maintain and operate one acre of pastureland for livestock per month. Even if the land is owned a lower number means that the land is cheaper.';
			}else if(object.class_desc === 'PRODUCTION'){
				chart.title = 'Total Production Costs Per Year';
				chart.desc = 'This is the summative total of how much money farm operations spend per year. Consists of many things, land maintenance, taxes, livestock feed, etc.';
			}else if(object.class_desc === 'PER COW-CALF'){
				chart.title = 'Cost of One Cow per Month';
				chart.desc = 'The total cost to own and care for a cow or calf per month.';
			}else if(object.class_desc === 'PER HEAD'){
				chart.title = 'Cost of Any Livestock per Month';
				chart.desc = 'The total cost to own and care for any livestock per month as an average between all common livestock.';
			}
		}else if($scope.contextualInformation.selected === "Income"){
			if(object.class_desc === 'FOREST PRODUCTS, (EXCL CHRISTMAS TREES & SHORT TERM WOODY CROPS & MAPLE SYRUP)'){
				chart.title = 'Total Earnings from Forest Products';
				chart.desc = 'Total earnings from forest products. Does not include earnings from christmas trees, short woody crops, or maple syrup.';
			}else if(object.class_desc === 'AG TOURISM & RECREATIONAL SERVICES'){
				chart.title = 'Total Earnings from Agricultural Tourism';
				chart.desc = 'Agricultural tourism consists of tourists staying at a farm or ranch for any time period.';
			}else if(object.class_desc === 'GOVT PROGRAMS, STATE & LOCAL'){
				chart.title = 'Total Earnings from State and Local Government Programs';
				chart.desc = 'Total earnings from government programs that give incentives for the production of certain types of crops or reducing production of certain crops.';
			}else if(object.class_desc === 'PATRONAGE DIVIDENDS & REFUNDS FROM COOPERATIVES'){
				chart.title = 'Total Earnings from Cooperatives';
				chart.desc = 'A cooperative is a type of farm that is owned and run jointly by several members who all share profits.';
			}else if(object.class_desc === 'FEDERAL'){
				chart.title = 'Total Earnings from Federal Government Programs';
				chart.desc = 'Total earnings from federally mandated government programs that give incentives for the production of certain types of crops or reducing production of certain crops.';
			}
		}
	}
	
	var setData = function(state){
		
		var first = stateService.getImages(state.replace("_", " "));
		
		var second = stateService.getWikipediaInformation(state.replace("_", " "));
		
		var third = locationService.getStateLatLng(state.replace("_", "%20"));
		
		$q.all([first, second, third]).then(function(data){
			
			$scope.loading = dataService.toggleLoading();
						
			$scope.stateImageOne = data[0][0];
			$scope.stateImageTwo = data[0][1];
			$scope.stateDescription = data[1][0];
			$scope.descriptionReference = data[1][1];
			
			$timeout(function(){
				google.maps.event.trigger(mapOne, 'resize');
				google.maps.event.trigger(mapTwo, 'resize');
				mapOne.setCenter(data[2]);
				mapTwo.setCenter(data[2]);
				$scope.stateMarker = data[2];
			}, 10);
		});
	};
	
	$scope.changeSortType = function(cat){
		if(cat === $scope.sortType){
			if($scope.sortReverse === false){
				$scope.sortReverse = true;
			}else{
				$scope.sortReverse = false;
			}
		}else{
			$scope.sortType = cat;
			$scope.sortReverse = false;
		}
	};
	
	/**Applies a class to every other TD based on NG-REPEAT index*/
	$scope.getTableColor = function(index){
		if(index%2 === 1){
			return true;
		}else{
			return false;
		}
	};
	
	/**Requires the states array to be sorted in ascending order by points*/
	$scope.getScoreMax = function(){
		return $scope.states[$scope.states.length-1].points;
	};
	
	/**Changes the score bar color based on whether the dataset is good with a higher number or lower number*/
	$scope.getScoreBarColor = function(points){
		var max = $scope.getScoreMax();
		var max = parseInt(max);
		
		var points = parseInt(points);
		
		var percentage = Math.floor((points/max)*100);
		
		
		if($scope.contextualInformation.selected === "Expenses"){
			if(percentage > 80){
				return "alert";
			}else if(percentage > 40 && percentage <= 80){
				return null;
			}else if(percentage <= 40){
				return "success";
			}else{
				return null;
			}
		}else if($scope.contextualInformation.selected === "Income"){
			if(percentage > 80){
				return "success";
			}else if(percentage > 40 && percentage <= 80){
				return null;
			}else if(percentage <= 40){
				return "alert";
			}else{
				return null;
			}
		}
	};
	
	$scope.getStateDataValue = function(){
		var states = stateService.getStates();
		return states[$scope.selectedState].data;
	};
	
	/**Returns state max*/
	$scope.getStateMax = function(){
		return $scope.max;
	}
	
	/**Returns the data confidence percentage*/
	$scope.getStatePercentage = function(){
		return Math.round(($scope.getStateDataValue()/$scope.getStateMax())*100);
	};
	
	$scope.$on('mapInitialized', function(event, evtMap) {
		if(mapOne === null){
			mapOne = evtMap;
			mapOne.setCenter({lat: 39, lng: 89});
			mapOne.setZoom(6);
			mapOne.setOptions($scope.mapOptions);
		}else{
			mapTwo = evtMap;
			mapTwo.setCenter({lat: 39, lng: 89});
			mapTwo.setZoom(6);
			mapTwo.setOptions($scope.mapOptions);
		}	
	});
	
	$scope.mapOptions = { 
		scrollwheel: false,
		draggable: false,
		disableDoubleClickZoom: true,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};		
}]);