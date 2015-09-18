var Helper = angular.module('nwHelper', []);

Helper.factory('locationService', ['$http', '$q', function($http, $q){
	
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

Helper.factory('stateService', ['$http', '$q', function($http, $q) {
	
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
  
Helper.factory('mathService', function(){
	
	var getAverage = function(dataObject){
		var sum = 0;
		var data = dataObject.data;
		
		for(var i = 0; i < data.length; i++){
			var number = parseFloat(data[i].value);
			sum += number;
		}
		
		var average = sum/data.length;
		
		return Math.floor( average );
	};
	
	var sortData = function(dataObject){
		var data = dataObject.data;
		
		data.sort(function(a,b){
			return parseFloat(a.value) - parseFloat(b.value);
		});
		
		return dataObject;
	};
	
	var sortArrayAscending = function(dataObject){
		var data = dataObject;
		
		data.sort(function(a,b){
			return parseFloat(a.points) - parseFloat(b.points);
		});
		
		return dataObject;
	};
	
	var sortArrayDescending = function(dataObject){
		var data = dataObject;
		
		data.sort(function(a,b){
			return parseFloat(b.points) - parseFloat(a.points);
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
		sortArrayAscending: function(data){
			return sortArrayAscending(data);
		},
		sortArrayDescending: function(data){
			return sortArrayDescending(data);
		}
	}
});

Helper.factory('dataService', ['stateService', function(stateService) {
	
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