app.controller('mappingController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {

	$scope.currentTitlePage = 1;
	$scope.disbleContainer = true;
	$scope.selectedBranchId = $routeParams.branchId;
	$scope.selectedBranchName = localStorage.getItem("branchName");
	$scope.regionTitle = {
		model : null,
		availableOptions : []
	};
	
	$scope.pageModel = {
		currentPage : 1,
		enableButtons : true
	}
	$scope.normalizedRegionTitle = {
		model : null,
		availableOptions : []
	};

	$scope.filterValue = "";

	$scope.regionUse = {
		model : null,
		availableOptions : []
	};

	$scope.init = function() {// called to aviod page container issue
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});

		console.log("On load");
		$scope.loadRegionTitleData(1);
	};

	$scope.filterCodes = function(obj) {
		var filterVal = $scope.filterValue.toUpperCase();

		if ($scope.filterValue === '') {
			return true;
		}

		if (obj.name.indexOf(filterVal) === -1) {
			return false;
		} else {
			return true;
		}
	};

	$scope.loadRegionTitleData = function(page) {
		if(page === undefined){
			flashErrorMsg('mappingErrorMsg', "Unknown page to load");
			return
		}
		
		if(page === 0){
			flashErrorMsg('mappingErrorMsg', "Reached to First page");
			return
		}
		
		$scope.pageModel.enableButtons = false;
		flashErrorMsg('mappingErrorMsg', "Loading page " + page );
		$http({
			url : hostUrl + "/api-rc-nlp/regions/titles?key=regiontitle&value=&page="+page+"&limit=500",
			method : "GET"

		}).then(function(response) {
			console.log(response);
			var regionTitles = createRegionTitleModel(response.data);
			if (regionTitles.availableOptions.length > 0) {
				$scope.regionTitle = regionTitles;
				$scope.pageModel.currentPage = page;
				$scope.isResultEnabled = true;
				$scope.disbleContainer = false;
			} else {
				flashErrorMsg('mappingErrorMsg', "No more records found");
				$scope.isResultEnabled = false;
			}
			
			$scope.pageModel.enableButtons = true;
		}, function(response) {
			console.log("Error Happned while Getting normalizedRegionTitle Service");
			flashErrorMsg('mappingErrorMsg', "Error while getting the records");
			$scope.myErrr = false;
			$scope.showError = true;
			$scope.pageModel.enableButtons = true;
		});

	}

	$scope.loadMappingData = function() {
		$scope.disbleContainer = true;
		var normalizedTitleId = $scope.regionTitle.model.toString().split('_')[1];
		$http({
			url : hostUrl + '/api-rc-nlp/regions/normalizedtitles?normalizedRegionId=' + normalizedTitleId + "&page=1&limit=180",
			method : "GET"

		}).then(function(response) {
			console.log(response);
			$scope.normalizedRegionTitle = createNormalizedRegionTitleModel(response.data);

			if ($scope.normalizedRegionTitle.availableOptions.length > 0) {
				$scope.isResultEnabled = true;
				$scope.myErrr = false;
				$scope.showError = false;
				$scope.loadRegionUseData($scope.normalizedRegionTitle.availableOptions[0].value);
				$scope.disbleContainer = false;
			} else {
				$scope.myErrr = false;
				$scope.showError = true;
				$scope.isResultEnabled = false;
			}
		}, function(response) {
			console.log("Error Happned while Getting normalizedRegionTitle Service");
			$scope.myErrr = false;
			$scope.showError = true;
		});

	}

	$scope.loadRegionUseData = function(normalizedId) {
		$scope.disbleContainer = true;

		$http({
			url : hostUrl + '/api-rc-nlp/regions/regionusesbynid?normalizedRegionId=' + normalizedId + "&page=1&limit=180",
			method : "GET"

		}).then(function(response) {
			console.log(response);
			$scope.regionUses = createRegionUseModel(response.data);

			if ($scope.regionUses.availableOptions.length > 0) {
				$scope.isResultEnabled = true;
				$scope.myErrr = false;
				$scope.showError = false;
				$scope.disbleContainer = false;
			} else {
				$scope.myErrr = false;
				$scope.showError = true;
				$scope.isResultEnabled = false;
			}
		}, function(response) {
			console.log("Error Happned while Getting RegionUse Service");
			$scope.myErrr = false;
			$scope.showError = true;
		});

	}

	function createRegionTitleModel(data) {
		var regionTitles = {
			model : null,
			availableOptions : []
		};
		var regions = data.regions;
		for (var i = 0; i < regions.length; i++) {
			var region = regions[i];
			var resRegion = {};
			resRegion.data = region;

			resRegion.name = region.title;
			resRegion.value = region.regionTitleId + '_' + region.normalizedTitleId;

			regionTitles.availableOptions.push(resRegion);
		}

		return regionTitles;
	}

	function createNormalizedRegionTitleModel(data) {
		var normalizedRegionTitle = {
			model : null,
			availableOptions : []
		};
		var results = [];
		var regions = data.regions;
		for (var i = 0; i < regions.length; i++) {
			var region = regions[i];
			var resRegion = {};
			resRegion.data = region;

			resRegion.name = region.title;
			resRegion.value = region.normalizedRegionTitleId;

			normalizedRegionTitle.availableOptions.push(resRegion);
		}
		return normalizedRegionTitle;
	}

	function createRegionUseModel(data) {
		var regionUses = {
			model : null,
			availableOptions : []
		};
		var regions = data.regions;
		for (var i = 0; i < regions.length; i++) {
			var region = regions[i];
			var resRegion = {};
			resRegion.data = region;

			resRegion.name = region.description;
			resRegion.value = region.regionUseId;

			regionUses.availableOptions.push(resRegion);
		}
		return regionUses;
	}

	$scope.tabClick = function() {
		$location.path("regboilersearch");
	};
	$scope.searchtabClick = function() {
		$location.path("regsearch");
	};
	
	function flashErrorMsg(errModelName, errMsg){
		$scope[errModelName] = errMsg;
		$timeout(function() {
			$scope[errModelName] = '';
		}, 3000);
	}
	$scope.init();

});
