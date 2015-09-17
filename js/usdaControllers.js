var USDAControllers = angular.module('usdaControllers', [
'mm.foundation',
'ngMap',
'chart.js',
'ngAnimate'
]);

USDAControllers.factory('locationService', ['$http', '$q', function($http, $q){
	
	var getStateLatLng = function(state){
		
		var req = {};
		req.method = "JSONP";
		req.url = "http://dev.virtualearth.net/REST/v1/Locations?output=json&jsonp=JSON_CALLBACK&CountryRegion=US&adminDistrict=" + state + "&key=AgRH1NfLoOiOYRppfNJv6JAbhhnTEmXIoxjKvb7c0-AOC3s-Zo8rVIMGouCobWDx";
		
		var latlng = {lat:"", lng:""};
		
		var deferred = $q.defer();
		
		$http(req).success(function(data, status, headers, config){
			var coordinateData = angular.fromJson(data);
			if(coordinateData.resourceSets[0].resources[0] == null){
				console.log("Missed " + state);
				getStateLatLng(state).then(function(data){
					deferred.resolve(data);
				});
			}else if(coordinateData.resourceSets[0].resources[0].point !== null){
				latlng.lat = coordinateData.resourceSets[0].resources[0].point.coordinates[0];
				latlng.lng = coordinateData.resourceSets[0].resources[0].point.coordinates[1];
				//console.log(latlng);
				deferred.resolve(latlng);
			}else if(coordinateData.resourceSets[0].resources[0].geocodePoints !== null){
				latlng.lat = coordinateData.resourceSets[0].resources[0].geocodePoints.coordinates[0];
				latlng.lng = coordinateData.resourceSets[0].resources[0].geocodePoints.coordinates[1];
				console.log(latlng);
				deferred.resolve(latlng);
			}
		}).error(function(data, status, headers, config){
			console.log(status);
			deferred.reject(status);
		});
		
		return deferred.promise;
	};
	
	return {
		getStateLatLng: function(state) {
			return getStateLatLng(state);
		}
	};
	
}]);

USDAControllers.factory('stateService', ['$http', '$q', function($http, $q) {
	
	var CleanStates = function(){
		 var cleanStates = {
			alabama       : {points : 0, data : 0, set : 0, hit : 0},
			alaska        : {points : 0, data : 0, set : 0, hit : 0},
			arizona       : {points : 0, data : 0, set : 0, hit : 0},
			arkansas      : {points : 0, data : 0, set : 0, hit : 0},
			california    : {points : 0, data : 0, set : 0, hit : 0},
			colorado      : {points : 0, data : 0, set : 0, hit : 0},
			connecticut   : {points : 0, data : 0, set : 0, hit : 0},
			delaware      : {points : 0, data : 0, set : 0, hit : 0},
			florida       : {points : 0, data : 0, set : 0, hit : 0},
			georgia       : {points : 0, data : 0, set : 0, hit : 0},
			hawaii        : {points : 0, data : 0, set : 0, hit : 0},
			idaho         : {points : 0, data : 0, set : 0, hit : 0},
			illinois      : {points : 0, data : 0, set : 0, hit : 0},
			indiana       : {points : 0, data : 0, set : 0, hit : 0},
			iowa          : {points : 0, data : 0, set : 0, hit : 0},
			kansas        : {points : 0, data : 0, set : 0, hit : 0},
			kentucky      : {points : 0, data : 0, set : 0, hit : 0},
			louisiana     : {points : 0, data : 0, set : 0, hit : 0},
			maine         : {points : 0, data : 0, set : 0, hit : 0},
			maryland      : {points : 0, data : 0, set : 0, hit : 0},
			massachusetts : {points : 0, data : 0, set : 0, hit : 0},
			michigan      : {points : 0, data : 0, set : 0, hit : 0},
			minnesota     : {points : 0, data : 0, set : 0, hit : 0},
			mississippi   : {points : 0, data : 0, set : 0, hit : 0},
			missouri      : {points : 0, data : 0, set : 0, hit : 0},
			montana       : {points : 0, data : 0, set : 0, hit : 0},
			nebraska      : {points : 0, data : 0, set : 0, hit : 0},
			nevada        : {points : 0, data : 0, set : 0, hit : 0},
			new_hampshire : {points : 0, data : 0, set : 0, hit : 0},
			new_jersey    : {points : 0, data : 0, set : 0, hit : 0},
			new_mexico    : {points : 0, data : 0, set : 0, hit : 0},
			new_york      : {points : 0, data : 0, set : 0, hit : 0},
			north_carolina: {points : 0, data : 0, set : 0, hit : 0},
			north_dakota  : {points : 0, data : 0, set : 0, hit : 0},
			ohio          : {points : 0, data : 0, set : 0, hit : 0},
			oklahoma      : {points : 0, data : 0, set : 0, hit : 0},
			oregon        : {points : 0, data : 0, set : 0, hit : 0},
			pennsylvania  : {points : 0, data : 0, set : 0, hit : 0},
			rhode_island  : {points : 0, data : 0, set : 0, hit : 0},
			south_carolina: {points : 0, data : 0, set : 0, hit : 0},
			south_dakota  : {points : 0, data : 0, set : 0, hit : 0},
			tennessee     : {points : 0, data : 0, set : 0, hit : 0},
			texas         : {points : 0, data : 0, set : 0, hit : 0},
			utah          : {points : 0, data : 0, set : 0, hit : 0},
			vermont       : {points : 0, data : 0, set : 0, hit : 0},
			virginia      : {points : 0, data : 0, set : 0, hit : 0},
			washington    : {points : 0, data : 0, set : 0, hit : 0},
			west_virginia : {points : 0, data : 0, set : 0, hit : 0},
			wisconsin     : {points : 0, data : 0, set : 0, hit : 0},
			wyoming       : {points : 0, data : 0, set : 0, hit : 0}
		};
		
		return{
			getClean: function(){
				return cleanStates;
			}
		}
	};
	
	var states = null;
	
	var getStateData = function(options){
		
		var newMarkerData = {};
		var req = {};
		req.method = "GET";
		req.url = "http://nass-api.azurewebsites.net/api/api_get?agg_level_desc=STATE";
		
		var keys = Object.keys(options);
		for(var i = 0; i < keys.length; i++){
			req.url += "&";
			req.url += keys[i] + "=" + options[keys[i]];
		}
		
		var deferred = $q.defer();
		
		//console.log(req.url);
		$http(req).success(function(data, status, headers, config){
			newMarkerData = angular.fromJson(data);		
			deferred.resolve(newMarkerData);
			return deferred.promise;
		}).error(function(data, status, headers, config){
			console.log(status);
			deferred.reject(status);
		});
		return deferred.promise;
	};
	
	var getImages = function(stateName){
		
		var images = [];
		
		var req = {};
		req.method = "GET";
		req.headers = {
			Authorization: "Basic " + btoa("wW7wO99BMioS0cs/J+bsL1VF/Pa/qfNduvR9vr/L5rg:wW7wO99BMioS0cs/J+bsL1VF/Pa/qfNduvR9vr/L5rg")
		};
		req.url = "https://api.datamarket.azure.com/Bing/Search/v1/Image?$format=JSON&Query=%27" + stateName + "%20landscape%27&Adult=%27Moderate%27&ImageFilters=%27Size%3AMedium%2BAspect%3AWide%27";
		
		var deferred = $q.defer()
		
		$http(req).success(function(data, status, headers, config){
			//console.log(data);
			
			images.push(data.d.results[0].Thumbnail.MediaUrl);
			images.push(data.d.results[1].Thumbnail.MediaUrl);
			
			deferred.resolve(images);
			
		}).error(function(data, status, headers, config){
			console.log(status);
			deferred.reject(status);
		});
		
		return deferred.promise;
		
	};
	
	var getWikipediaInformation = function(stateName){
		
		var stateInformation = [];
		
		var req = {};
		req.method = "GET";
		req.headers = {
			Authorization: "Basic " + btoa("wW7wO99BMioS0cs/J+bsL1VF/Pa/qfNduvR9vr/L5rg:wW7wO99BMioS0cs/J+bsL1VF/Pa/qfNduvR9vr/L5rg")
		};
		req.url = "https://api.datamarket.azure.com/Bing/Search/v1/Web?$format=json&Query=%27" + stateName + "%20state%20wikipedia%27";
		
		var deferred = $q.defer();
		
		$http(req).success(function(data, status, headers, config){
			//console.log(data);
			for(var i = 0; i < data.d.results.length; i++){
				if(data.d.results[i].Title.indexOf("University") === -1){
					var temp = data.d.results[i].Description;
					temp = temp.substring(0, stateName.length) + " " + temp.substring(temp.indexOf("is"));
					if(temp.indexOf("...") !== -1){
						temp = temp.substring(0, temp.indexOf("...") - 1);
					}
					stateInformation.push(temp);
					stateInformation.push(data.d.results[i].Url);
					deferred.resolve(stateInformation);
					break;
				}
			}
		}).error(function(data, status, headers, config){
			console.log(status);
			deferred.reject(status);
		});
		
		return deferred.promise;
	};
	
	return {
		getStateData: function(options) {
			return getStateData(options);
		},
		getImages: function(stateName){
			return getImages(stateName);
		},
		getWikipediaInformation: function(stateName){
			return getWikipediaInformation(stateName);
		},
		getStates: function(){
			return states;
		},
		resetStates: function(){
			states = null;
			temp = new CleanStates();
			states = temp.getClean();
			//console.log(states);
		}
	};
	
}]);
  
USDAControllers.factory('mathService', function(){
	
	var getAverage = function(dataObject){
		var sum = 0;
		var data = dataObject.data;
		
		for(var i = 0; i < data.length; i++){
			var number = parseFloat(data[i].value);
			//console.log(number);
			//console.log(data[i]);
			sum += number;
		}
		
		var average = sum/data.length;
		
		return Math.floor( average );
	}
	
	var sortData = function(dataObject){
		var data = dataObject.data;
		
		data.sort(function(a,b){
			return parseFloat(a.value) - parseFloat(b.value);
		});
		
		return dataObject;
	}
	
	var sortArray = function(dataObject){
		var data = dataObject;
		
		data.sort(function(a,b){
			return parseFloat(a.points) - parseFloat(b.points);
		});
		
		return dataObject;
	}
	
	return {
		getAverage: function(data){
			return getAverage(data);
		},
		sortData: function(data){
			return sortData(data);
		},
		sortArray: function(data){
			return sortArray(data);
		}
	}
});

USDAControllers.factory('dataService', ['stateService', function(stateService) {
	
	//Sets up all dataobjects for processing by adding data and sorting
	
	var removeEmpties = function(dataObject){
		
		var count = 0;
		
		for(var i = dataObject.length-1; i >= 0; i--){
			if(Object.keys(dataObject[i]).length === 0){
				dataObject.splice(i, 1);
				count++;
			}
		}
		
		return count;
	};
	
	var removeBadData = function(dataObject){
				
		for(var i = dataObject.data.length - 1; i >= 0; i--){
			if(dataObject.data[i].value === "(S)" || dataObject.data[i].value === "(D)"){
				dataObject.data.splice(i, 1);
			}
		}		
	}
	
	var removeComma = function(dataObject){
		for(var i = 0; i < dataObject.data.length; i++){
			if(typeof dataObject.data[i].value === 'string' || dataObject.data[i].value instanceof String){
				while(dataObject.data[i].value.indexOf(",") !== -1){
					dataObject.data[i].value = dataObject.data[i].value.replace(",", "");
				}
			}
		}	
	}
	
	var reduceValue = function(dataObject){
		for(var i = 0; i < dataObject.data.length; i++){
			if(parseFloat(dataObject.data[i].average) > 1000000000){
				dataObject.data[i].value = (parseFloat(dataObject.data[i].value)/1000000000);
				dataObject.data[i].average = (parseFloat(dataObject.data[i].average)/1000000000);
				dataObject.data[i].unit_desc += " (Billions)";
				continue;
			}else if(parseFloat(dataObject.data[i].average) > 1000000){
				dataObject.data[i].value = (parseFloat(dataObject.data[i].value)/1000000);
				dataObject.data[i].average = (parseFloat(dataObject.data[i].average)/1000000);
				dataObject.data[i].unit_desc += " (Millions)";
				continue;
			}
		}	
	}
	
	var addAverage = function(dataObject, average){
		for(var i = 0; i < dataObject.data.length; i++){
			dataObject.data[i]["average"] = average;
		}
	};
	
	var addPoints = function(dataObject){
		for(var i = 0; i < dataObject.data.length; i++){
			dataObject.data[i]["points"] = i+1;
		}
	};
	
	//Tracks and modifies states object to verify correct data processing
	
	var loading = false;
	var years = 0;
	
	var toggleLoading = function(){
		if(loading === false){
			loading = true;
		}else{
			loading = false;
		}
		return loading;
	};
	
	var trackData = function(key, data){
		var states = stateService.getStates();
		states[key].set++;
		if(states[key].set > years){
			console.log(key);
			console.log(data);
		}
	};
	
	var addHit = function(key){
		var states = stateService.getStates();
		states[key].hit++;
	};
	
	var addPointsReset = function(length){
		var states = stateService.getStates();
		var keys = Object.keys(states);
		for(var i = 0; i < keys.length; i++){
			if(states[keys[i]].hit !== 1){
				states[keys[i]].points += Math.round(length/2);
				states[keys[i]].hit++;
			}
		}
		
		for(var i = 0; i < keys.length; i++){
			states[keys[i]].hit = 0;
		}
	};
	
	var resetTrackData = function(){
		var states = stateService.getStates();
		var keys = Object.keys(states);
		for(var i = 0; i < keys.length; i++){
			states[keys[i]].set = 0;
		}
	};
	
	return {
		removeEmpties: function(dataObject){
			return removeEmpties(dataObject);
		},
		removeBadData: function(dataObject){
			return removeBadData(dataObject);
		},
		removeComma: function(dataObject){
			return removeComma(dataObject);
		},
		reduceValue: function(dataObject){
			return reduceValue(dataObject);
		},
		addAverage: function(dataObject, average){
			return addAverage(dataObject, average);
		},
		addPoints: function(dataObject){
			return addPoints(dataObject);
		},
		
		toggleLoading: function(){
			return toggleLoading();
		},
		trackData: function(key, data){
			return trackData(key, data);
		},
		addHit: function(key){
			return addHit(key);
		},
		addPointsReset: function(length){
			return addPointsReset(length);
		},
		resetTrackData: function(){
			return resetTrackData();
		},
		setYear: function(yearFromHome){
			years = yearFromHome;
		}
	}
}]);

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
	}
	
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
	}
	
	$scope.contextualInformation = null;
	
	$scope.loading = false;
	
	$scope.states = [];
	$scope.stateSelected = false;
	
	//For list sorting
	$scope.sortType = 'points';
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
		$scope.sortType = 'points';
		$scope.sortReverse = false;
		$scope.max = 0;
		$scope.selectedSetData = [];
		$scope.empties = 0;
	}
	
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
			
			mathService.sortArray($scope.states);
			
			for(var i = 0; i < $scope.states.length; i++){
				$scope.states[i]["rank"] = i + 1;
			}
			
			$scope.loading = dataService.toggleLoading();
			//console.log($scope.states);
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
			
			mathService.sortArray($scope.states);
			
			for(var i = 0; i < $scope.states.length; i++){
				$scope.states[i]["rank"] = i + 1;
			}
			
			$scope.loading = dataService.toggleLoading();
			//console.log($scope.states);
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
	
	$scope.getTableColor = function(index){
		//console.log(index);
		if(index%2 === 1){
			return true;
		}else{
			return false;
		}
	};
	
	$scope.getScoreMax = function(){
		//console.log("Here1");
		return $scope.states[$scope.states.length-1].points;
	};
	
	$scope.getScoreBarColor = function(points){
		//console.log("Here");
		var max = $scope.getScoreMax();
		var max = parseInt(max);
		
		var points = parseInt(points);
		
		var percentage = Math.floor((points/max)*100);
		
		//console.log(percentage);
		
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
	
	$scope.getStateMax = function(){
		return $scope.max;
	}
	
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
		
		//console.log(mapOne);
		//console.log(mapTwo);	
	});
	
	$scope.mapOptions = { 
		scrollwheel: false,
		draggable: false,
		disableDoubleClickZoom: true,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};		
}]);