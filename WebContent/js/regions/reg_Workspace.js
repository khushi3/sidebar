app.controller('workspaceController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {

	console.log("JS Loaded");

	$scope.searchedContent = [];
	$scope.selectedEditRow = null;
	$scope.editContent = [];
	$scope.isEditResultEnabled = true;
	$scope.editTableParams;
	$scope.isResultEnabled = false;

	$scope.mappingRegion = "";

	$scope.showNormalizedTitle = false;
	$scope.showRegionUse = false;

	$scope.normalizeTitleObjArr = [];
	$scope.usesObjArr = [];

	$scope.selectedNormalizedTitlesObj = {
		items : []
	};
	$scope.selectedUsesObj = {
		items : []
	};

	$scope.regionTest = {
		comments : ""
	};
	$scope.showTestStatus = false;
	$scope.testResponse = "";

	$scope.regionScope.submitForTest = function() {
		$scope.regionTest.comments = $scope.comments;
		$scope.submitForTest();
	};

	$scope.selectedBranchName = localStorage.getItem("branchName");

	$scope.goBack = function() {
		$location.path("regsearch/" + localStorage.getItem("regionBranchId"));
	}

	$scope.init = function() {// called to aviod page container issue
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});
		$scope.isResultEnabled = true;
		$scope.myErrr = false;
		$scope.showError = false;

		$scope.searchTableParams = getNgtableParam($scope.searchedContent);

		loadRegionTitleFilter();
		loadEditTableData();
		loadNormalizedregiontitle();

	}

	$scope.shiftDataToLeft = function() {
		var optionsVal = jQuery(document).find("#selId").val();
		var optionsAdd = jQuery(document).find("#selId").find('option:selected');

		if ($scope.showNormalizedTitle) {

			if ($scope.normalizeTitleObjArr.length == 1 || optionsVal.length > 1) {
				$scope.normalizedErrr = true;
				$timeout(function() {
					$scope.normalizedErrr = false;
				}, 3000);
				return;
			}
			for ( var x in optionsVal) {
				var normalizedRegionTitleObj = {};
				normalizedRegionTitleObj.normalizedRegionTitleId = optionsAdd[x].value;
				normalizedRegionTitleObj.normalizedRegionTitle = optionsAdd[x].text;
				$scope.normalizeTitleObjArr.push(normalizedRegionTitleObj);
				optionsAdd.remove();
			}
		} else {
			for ( var x in optionsVal) {
				var useObj = {};
				useObj.regionUseId = optionsAdd[x].value;
				useObj.regionUse = optionsAdd[x].text;
				$scope.usesObjArr.push(useObj);
				optionsAdd.remove();
			}
		}
	};

	$scope.shiftDataToRight = function() {

		if ($scope.showNormalizedTitle && $scope.selectedNormalizedTitlesObj.items.length > 0) {
			removeNormalizedTtilesFromList($scope.selectedNormalizedTitlesObj.items);

			for (var i = 0; i < $scope.normalizeTitleObjArr.length; i++) {
				jQuery(document).find("#selId").append(
						"<option value ='" + $scope.normalizeTitleObjArr[i].normalizedRegionTitleId + "'>"
								+ $scope.normalizeTitleObjArr[i].normalizedRegionTitle + "</option>");
			}
		} else if ($scope.selectedUsesObj.items.length > 0) {
			removeUsesFromList($scope.selectedUsesObj.items);

			for (var i = 0; i < $scope.usesObjArr.length; i++) {
				jQuery(document).find("#selId").append(
						"<option value ='" + $scope.usesObjArr[i].regionUseId + "'>" + $scope.usesObjArr[i].regionUse + "</option>");
			}
		}
	};

	$scope.openRegionUsePopup = function(regionObj) {

		$scope.showNormalizedTitle = false;
		$scope.showRegionUse = true;

		var regionUseArr = regionObj.regionUseArr;
		loadRegionUses();

		$scope.usesObjArr = [];
		for (var i = 0; i < regionUseArr.length; i++) {
			var regionUseObj = regionUseArr[i];
			$scope.usesObjArr.push(regionUseArr[i]);
		}
		$scope.mappingRegion = regionObj;

		var popupnrt = jQuery(document).find("#myModal");
		if (popupnrt.hasClass('hide')) {

			popupnrt.toggleClass("show");
		}
	};

	$scope.openNormalizedRegionPopup = function(regionObj) {

		$scope.showNormalizedTitle = true;
		$scope.showRegionUse = false;
		loadNormalizedregiontitles();
		var normalizedRegionTitleObj = regionObj.normalizedRegionTitleObj;

		$scope.normalizeTitleObjArr = [];
		if (normalizedRegionTitleObj.normalizedRegionTitle !== '') {
			$scope.normalizeTitleObjArr.push(normalizedRegionTitleObj);
		}

		$scope.mappingRegion = regionObj;

		var popupnrt = jQuery(document).find("#myModal");
		if (popupnrt.hasClass('hide')) {

			popupnrt.toggleClass("show");
		}
	};

	$scope.assignRegionUses = function() {

		var regionOptn = jQuery(document).find("#selId option").data("optionname");
		var str = "";

		console.log(regionOptn);
		var regionUseArr = [];
		if ($scope.showRegionUse) {

			if ($scope.usesObjArr.length === 0) {
				alert("Please select at leaset one 'Region Use'");
				return;
			}

			$scope.mappingRegion.regionUseArr = [];
			for (var i = 0; i < $scope.usesObjArr.length; i++) {
				$scope.mappingRegion.regionUseArr.push($scope.usesObjArr[i]);
			}

			$scope.mappingRegion.regionUseObj = $scope.mappingRegion.regionUseArr[0];
		} else {
			if ($scope.normalizeTitleObjArr.length === 0) {
				alert("Please select a 'Normalized Region Title'");
				return;
			}

			$scope.mappingRegion.normalizedRegionTitle = $scope.normalizeTitleObjArr[0].normalizedRegionTitle
			$scope.mappingRegion.normalizedRegionTitleId = $scope.normalizeTitleObjArr[0].normalizedRegionTitleId

		}

		$scope.mappingRegion = "";
		console.log(str);
		$scope.closeRegionUsePopup();
	}

	function loadRegionUses() {
		$scope.regionsName = "";

		$http({
			method : "GET",
			url : regionUrl + '/uses' + "?key=description&value=&limit=100&page=1"
		}).then(function(response) {
			console.log(response);
			$scope.regionsName = response.data.regions;

		});
	}

	function loadNormalizedregiontitles() {
		$scope.regionsName = "";

		$http({
			method : "GET",
			url : regionUrl + '/normalizedtitles?limit=417&page=1'
		}).then(function(response) {
			$scope.regionsName = response.data.regions;

		});

	}

	function removeNormalizedTtilesFromList(subNormalizedTitleList) {
		for (var i = 0; i < subNormalizedTitleList.length; i++) {
			for (var j = 0; j < $scope.normalizeTitleObjArr.length; j++) {
				if ($scope.normalizeTitleObjArr[j].normalizedRegionTitle == subNormalizedTitleList[i].normalizedRegionTitle) {
					$scope.normalizeTitleObjArr.splice(j, 1);
					break;
				}
			}
		}
	}

	function removeUsesFromList(subUseList) {
		for (var i = 0; i < subUseList.length; i++) {
			for (var j = 0; j < $scope.usesObjArr.length; j++) {
				if ($scope.usesObjArr[j].regionUse == subUseList[i].regionUse) {
					$scope.usesObjArr.splice(j, 1);
					break;
				}
			}
		}
	}

	$scope.filterData = function() {
		var FilterSearch = jQuery(document).find("#SearchData").val();
		jQuery(document).find("#selId").empty();
		jQuery(document).find("#selId").append("<option value ='" + FilterSearch + "'>" + FilterSearch + "</option>");

	}

	$scope.closeRegionUsePopup = function() {

		jQuery(document).find("#myModal").removeClass("show").addClass("hide");
		$scope.mappingRegion = "";

	}

	$scope.cancelEdit = function(regionObj, rowForm) {
		regionObj.isEditing = false;

	}

	$scope.revertDelete = function(regionObj, regionId) {

		$http({
			method : "DELETE",
			url : regionUrl + '/deleteEdit/' + regionObj.editedId,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			console.log(response);
			loadEditTableData();

		});
	}

	$scope.saveRegion = function(regionObj, regionId) {

		if (regionObj.regionTitle === '') {
			alert("Please provide a Value for 'Region Title'");
			return;
		}

		if (regionObj.normalizedRegionTitle === '') {
			alert("Please select a 'Normalized Region Title'");
			return;
		}

		regionObj.isEditing = false;

		var regUseArray = [];

		var regionUseArr = regionObj.regionUseArr;

		for (var i = 0; i < regionUseArr.length; i++) {
			var regionUse = {
				"regionUseId" : parseInt(regionUseArr[i].regionUseId),
				"description" : regionUseArr[i].regionUse
			}
			regUseArray.push(regionUse);
		}

		if (regionObj.editedId && regionObj.action === 'Add') {
			regionObj.action = "Edit";
		}

		var regionEditRequest = [ {
			"regionTitle" : {
				"regionTitleId" : regionObj.regionTitleId,
				"title" : regionObj.regionTitle
			},
			"normalizedRegionTitle" : {
				"normalizedRegionTitleId" : parseInt(regionObj.normalizedRegionTitleId),
				"title" : regionObj.normalizedRegionTitle
			},
			"regionUses" : regUseArray,
			"action" : regionObj.action,
			"branchId" : parseInt($routeParams.branchId)

		} ]

		if (regionObj.editedId) {
			$http({
				method : "PUT",
				url : regionUrl + '/branchedits/' + regionObj.editedId,
				data : angular.toJson(regionEditRequest),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response);
				loadEditTableData();

			});
		} else {
			removeEditedRegion(regionObj.regionId)
			$http({
				method : "POST",
				url : regionUrl + '/create',
				data : angular.toJson(regionEditRequest),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response);
				loadEditTableData();

			});
		}

	}

	$scope.editRegion = function(regionObj) {
		regionObj.normalizedRegionTitleObj = {};
		regionObj.normalizedRegionTitleObj.normalizedRegionTitle = regionObj.normalizedRegionTitle;
		regionObj.normalizedRegionTitleObj.normalizedRegionTitleId = regionObj.normalizedRegionTitleId;
		$scope.normalizedRegionsTitles.push(regionObj.normalizedRegionTitleObj);

		regionObj.isEditing = true
	}

	$scope.revertEditedRegion = function(regionObj) {
		$http({
			method : "DELETE",
			url : regionUrl + '/deleteEdit/' + regionObj.editedId,
			headers : {
				'Content-Type' : 'application/json'

			}
		}).then(function(response) {
			console.log(response);
			loadEditTableData();
		});
	}

	$scope.submitForTest = function() {

		$scope.testResponse = "";
		var editTableData = $scope.editTableParams.data;
		var selectedObjArr = [];
		for (var i = 0; i < editTableData.length; i++) {
			if (editTableData[i].isEdited != undefined && editTableData[i].isEdited) {
				if (editTableData[i].isSelected != undefined && editTableData[i].isSelected) {
					if (editTableData[i].editedId != undefined) {
						selectedObjArr.push(editTableData[i])
					}
				}
			}
		}

		if (selectedObjArr.length == 0) {
			alert("Please select atlest one Item for test");
		} else if ($scope.regionTest.comments == '') {
			alert("Please provide comments");
		} else {
			var testRequest = constructTestRequest(selectedObjArr, $scope.regionTest.comments);
			
			setTestData(testRequest.payload);
			$location.path("regteststatus/" + testRequest.testId);

		}

	}

	function postEditsForTest(testRequest) {
		$http({
			method : "POST",
			url : regionUrl + '/submitForTest',
			data : angular.toJson(testRequest),
			headers : {
				'Content-Type' : 'application/json',
				'Accept' : 'text/plain'
			}
		}).then(function(response) {
			console.log(response);
			$scope.showTestStatus = true;
			$scope.testResponse = response;
			setTestStatus(response);
			$location.path("regteststatus/" + $routeParams.branchId);
		}, function(response) {
			console.log("Error while submitting to the Test Service");
			$scope.showTestStatus = true;
			$scope.testResponse = response;
			setTestStatus(response);
			$location.path("regteststatus/" + $routeParams.branchId);
		});

	}

	function constructTestRequest(regionObjArray, documentVal) {
		var requestPayload = {
			workspaceIds : []
		};

		var testRequest = {
			testId : regionObjArray[0].testId,
			payload : requestPayload
		};

		for (var i = 0; i < regionObjArray.length; i++) {
			var regionObj = regionObjArray[i];
			requestPayload.workspaceIds.push(regionObj.editedId);
		}

		/*
		 * var titleArr = []; var testRequest = { titles : titleArr, document :
		 * documentVal }
		 * 
		 * for (var i = 0; i < regionObjArray.length; i++) { var regionObj =
		 * regionObjArray[i];
		 * 
		 * var titleObj = { titleId : regionObj.regionTitleId, title :
		 * regionObj.regionTitle, normalizedTitleId :
		 * regionObj.normalizedRegionTitleId }
		 * 
		 * titleArr.push(titleObj); }
		 */

		return testRequest;
	}

	function loadEditTableData() {

		var branchId = localStorage.getItem("regionBranchId");
		console.log(branchId);
		var editIds = getRegionWorkspaceIds();

		if (editIds !== undefined && editIds !== null && editIds.length > 0) {
			$http({
				method : "POST",
				url : regionUrl + '/editsbyids',
				data : angular.toJson(editIds),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response);
				$scope.editContent = [];
				$scope.editContent = createEditedRegionModel(response.data);
				console.log($scope.editContent);
				$scope.isResultEnabled = true;
				$scope.editTableParams = getNgtableParam($scope.editContent);
			}, function(response) {
				console.log("Error Happned while Calling Service");
			});
		} else {
			$http({
				method : "GET",
				url : regionUrl + '/editsbybranch?branchId=' + parseInt(branchId) + "&limit=20&page=1"

			}).then(function(response) {
				console.log(response);
				$scope.editContent = [];
				$scope.editContent = createEditedRegionModel(response.data);
				console.log($scope.editContent);
				$scope.isResultEnabled = true;
				$scope.editTableParams = getNgtableParam($scope.editContent);
			}, function(response) {
				console.log("Error Happned while Calling Service");
			});
		}
	}

	function createEditedRegionModel(data) {
		var results = [];
		var regions = data.edits;
		for (var i = 0; i < regions.length; i++) {
			var region = regions[i];
			var regionObj = {};
			regionObj.data = region;

			regionObj.regionId = i;
			regionObj.regionTitleId = region.regionTitleId;

			regionObj.normalizedRegionTitleObj = {};
			regionObj.normalizedRegionTitleObj.normalizedRegionTitleId = "";
			regionObj.normalizedRegionTitleObj.normalizedRegionTitle = "";

			regionObj.normalizedRegionTitleId = region.normalizedRegionTitleId;
			regionObj.normalizedRegionTitle = region.normalizedRegionTitle;

			regionObj.regionUseArr = region.regionUseArr;
			regionObj.regionUseObj = region.regionUseArr[0];

			if (region.isEdited !== undefined && region.isEdited === false) {
				regionObj.isEdited = false;
			} else {
				regionObj.isEdited = true;
			}

			regionObj.editedId = region.editId;
			regionObj.status = region.status;
			regionObj.action = region.action;
			regionObj.regionTitle = region.regionTitle;
			regionObj.editedRegionTitle = "";
			regionObj.ncid = region.ncid;
			regionObj.isSelected = false;
			regionObj.testId = region.testId;

			results.push(regionObj);
		}

		return results;
	}

	function loadNormalizedregiontitle() {
		$scope.regionsName = "";
		$http({
			method : "GET",
			url : regionUrl + '/normalizedtitles?limit=417&page=1'
		}).then(function(response) {
			console.log(response);
			$scope.regionsName = response.data.regions;
			$scope.normalizedRegionsTitles = [];
			for (var i = 0; i < response.data.regions.length; i++) {
				var regionTitle = {
					normalizedRegionTitleId : response.data.regions[i].normalizedRegionTitleId,
					normalizedRegionTitle : response.data.regions[i].title
				}
				$scope.normalizedRegionsTitles.push(regionTitle);
			}
			console.log($scope.regionsName.title);
		});

	}

	function loadRegionTitleFilter(regTitle) {

		console.log(regTitle);
		$http({
			method : "GET",
			url : regionUrl + '/titles?key=regiontitle&value' + "&limit=200&page=1"
		}).then(function(response) {
			console.log(response);
			$scope.regionsTitle = response.data.regions;
			console.log($scope.regionsTitle.title);

		});
	}

	function getNgtableParam(data) {
		var ngtable = new NgTableParams({
			page : 1,
			count : 5,
			sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});

		reloadTableContent(ngtable);
		return ngtable;
	}

	function reloadTableContent(table) {
		table.reload();
		table.page(1);
		table.sorting({});
	}

	$scope.init();
});
