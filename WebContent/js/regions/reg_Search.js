app.controller('regionSearchController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {

	console.log("regionSearchController Loaded");

	$scope.searchedContent = [];
	$scope.selectedRow = null;
	$scope.editContent = [];
	$scope.searchKey = "";
	$scope.isAdding = false;
	$scope.isResultEnabled = true;

	$scope.normalizedErrr = false;
	$scope.myErrr = false;
	$scope.showError = false;

	$scope.mappingRegion = "";
	$scope.clonedContent = [];

	$scope.searchTableParams;
	$scope.editTableParams;

	$scope.showNormalizedTitle = false;
	$scope.showRegionUse = false;

	$scope.normalizeTitleObjArr = [];
	$scope.usesObjArr = [];

	$scope.selectedBranchName = localStorage.getItem("branchName");
	$scope.selectedBranchId = $routeParams.branchId;

	$scope.selectedNormalizedTitlesObj = {
		items : []
	};
	$scope.selectedUsesObj = {
		items : []
	};
	
	$scope.navigateToWorkspace = function (){
		setRegionWorkspaceIds(null);
		$location.path("commonworkspace");
	}

	$scope.init = function() {// called to aviod page
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});

		$scope.myErrr = false;
		$scope.showError = false;
		$scope.searchTableParams = getNgtableParam($scope.searchedContent);

		loadRegionTitleFilter();
		loadEditTableData();

	};

	$scope.editRegion = function(regionObj) {
		regionObj.normalizedRegionTitleObj = {};
		regionObj.normalizedRegionTitleObj.normalizedRegionTitle = regionObj.normalizedRegionTitle;
		regionObj.normalizedRegionTitleObj.normalizedRegionTitleId = regionObj.normalizedRegionTitleId;

		regionObj.isEditing = true
	}

	$scope.searchRegions = function() {

		$scope.myErrr = false;
		if ($scope.searchKey === "" || $scope.searchKey === undefined) {
			$scope.myErrr = true;
		} else {
			$scope.myErrr = false;
			if ($scope.seclectedKey === "" || $scope.seclectedKey === undefined) {
				$scope.seclectedKey = "description";
			}
			if ($scope.searchKey) {

				$http({
					method : "GET",
					url : regionUrl + "?key=" + $scope.seclectedKey + "&value=" + $scope.searchKey + "&limit=100&page=1"
				}).then(function(response) {

					$scope.searchedContent = createSearchedUIDataModel(response.data);

					if ($scope.searchedContent.length > 0) {
						$scope.myErrr = false;
						$scope.showError = false;
						$scope.searchTableParams = getNgtableParam($scope.searchedContent);
					} else {
						$scope.myErrr = false;
						$scope.showError = true;
					}
				}, function(response) {
					console.log("Error Happned while Calling Service");
					$scope.myErrr = false;
					$scope.showError = true;
				});

			} else {
				$scope.searchTableParams = getNgtableParam($scope.searchedContent);
			}

		}
	};

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
			removeEditedRegion(regionObj.regionId);

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

	};

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

	$scope.cancelEdit = function(regionObj, rowForm) {
		regionObj.isEditing = false;

	}

	$scope.closeRegionUsePopup = function() {

		$scope.showNormalizedTitle = false;
		$scope.showRegionUse = false;
		jQuery(document).find("#myModal").removeClass("show").addClass("hide");
		$scope.mappingRegion = "";

	}

	$scope.filterData = function() {
		var FilterSearch = jQuery(document).find("#SearchData").val();
		jQuery(document).find("#selId").empty();
		jQuery(document).find("#selId").append("<option value ='" + FilterSearch + "'>" + FilterSearch + "</option>");

	}

	$scope.textBgHilight = function(regionId) {

		var hghlight = $('table[ng-table="editTableParams"] tr.editedRow').find("td div #regionList option");
		var regfiltr = $('table[ng-table="editTableParams"] tr.editedRow').find("td div #regfiltr" + regionId);
		regfiltr.removeClass("rowBG");
		hghlight.each(function() {
			if (regfiltr.val() == $(this).val()) {

				regfiltr.addClass("rowBG");
			}

			console.log("regfiltr" + regfiltr);

			console.log($(this).attr("value"));

		});

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

	$scope.moveRegionsToWorkspace = function() {
		var editTableData = $scope.editTableParams.data;
		var editedIdArr = [];
		for (var i = 0; i < editTableData.length; i++) {
			if (editTableData[i].isEdited != undefined && editTableData[i].isEdited) {
				if (editTableData[i].isSelected != undefined && editTableData[i].isSelected) {
					if (editTableData[i].editedId != undefined) {
						editedIdArr.push(editTableData[i].editedId)
					}
				}
			}
		}
		setRegionWorkspaceIds(editedIdArr);
		if (editedIdArr.length == 0) {
			alert("Please select atlest one Edited Item");
		} else {
			$location.path("regworkspace/" + $routeParams.branchId);
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

	$scope.cloneRow = function(index) {
		console.log("clonedRow index" + index);
		var region = $scope.searchedContent[index];
		region.action = "Edit";
		var clonedRegion = cloneObject(region);
		clonedRegion.isEditing = false;
		clonedRegion.isEdited = false;
		console.log(clonedRegion);
		clonedRegion.regionId = $scope.editContent.length;
		$scope.editContent.push(clonedRegion);
		$scope.clonedContent.push(clonedRegion);
		$scope.editTableParams = getNgtableParam($scope.editContent);

		console.log($scope.editContent);
		console.log($scope.editTableParams);

	}

	$scope.addNewRecord = function() {
		var regionObj = createNewRecord();
		regionObj.regionId = $scope.editContent.length;
		$scope.editContent.push(regionObj);
		$scope.clonedContent.push(regionObj);
		$scope.editTableParams = getNgtableParam($scope.editContent);
		console.log($scope.editContent);
		console.log($scope.editTableParams);
	};

	$scope.deleteRow = function(index) {

		$scope.selectedRow = index;
		console.log("markCopyRow index" + index);
		console.log($scope);
		var varient = $scope.searchedContent[index];
		varient.index = index;
		varient.action = "Delete";
		varient.regionId = $scope.editContent.length;
		$scope.editContent.push(varient);
		$scope.clonedContent.push(varient);
		$scope.btn_Status = false;
		$scope.editTableParams = getNgtableParam($scope.editContent);
		$scope.searchTableParams = getNgtableParam($scope.searchedContent);

		$scope.saveRegion(varient, varient.regionId);
	};

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

	function cloneObject(obj) {
		if (null == obj || "object" != typeof obj)
			return obj;
		console.log(obj);
		var copy = obj.constructor();

		for ( var attr in obj) {
			console.log(attr);
			console.log(obj.hasOwnProperty(attr));
			if (attr == "varString") {
				obj[attr] = "";
			}

			if (obj.hasOwnProperty(attr))
				copy[attr] = obj[attr];
		}

		console.log(copy);
		return copy;
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

			regionObj.status = region.status;
			regionObj.editedId = region.editId;
			regionObj.action = region.action;
			regionObj.regionTitle = region.regionTitle;
			regionObj.editedRegionTitle = "";
			regionObj.ncid = region.ncid;
			regionObj.isSelected = false;

			results.push(regionObj);
		}

		var editedRecordsLength = results.length;
		for (var i = editedRecordsLength; i < $scope.clonedContent.length + editedRecordsLength; i++) {
			var clonedObj = $scope.clonedContent[i];
			clonedObj.regionId = i;
			results.push(clonedObj);
		}
		return results;
	}

	function createSearchedUIDataModel(data) {
		var results = [];
		var regions = data.regions;
		for (var i = 0; i < regions.length; i++) {
			var region = regions[i];
			var regionObj = {};
			regionObj.data = region;

			regionObj.regionId = i;
			regionObj.regionTitleId = region.regionTitleId;
			regionObj.regionTitle = region.regionTitle;

			regionObj.normalizedRegionTitleObj = {};
			regionObj.normalizedRegionTitleObj.normalizedRegionTitleId = region.normalizedRegionTitleId;
			regionObj.normalizedRegionTitleObj.normalizedRegionTitle = region.normalizedRegionTitle;

			regionObj.normalizedRegionTitleId = region.normalizedRegionTitleId;
			regionObj.normalizedRegionTitle = region.normalizedRegionTitle;

			regionObj.regionUseObj = {
				regionUseId : region.regionUseId,
				regionUse : region.description
			};
			regionObj.regionUseArr = [ regionObj.regionUseObj ];

			regionObj.regionUseId = region.regionUseId;
			regionObj.regionUse = region.description;

			regionObj.editedNormalizedRegionTitle = "";
			regionObj.editedRegionTitle = "";
			regionObj.ncid = region.ncid;
			regionObj.isEdited = false;

			results.push(regionObj);
		}
		return results;
	}

	function removeEditedRegion(regionId) {
		for (var i = 0; i < $scope.clonedContent.length; i++) {
			if ($scope.clonedContent[i].regionId == regionId) {
				$scope.clonedContent.splice(i, 1);
				break;
			}
		}
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

	function reloadTableContent(table) {
		table.reload();
		table.page(1);
		table.sorting({});
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

	function createNewRecord() {
		var newRegion = {};

		newRegion.action = "Add";
		newRegion.regionTitleId = "";
		newRegion.regionUseId = [];
		newRegion.regionTitleId = -1;

		newRegion.regionUse = "Default";
		newRegion.regionUseId = -1;
		newRegion.regionTitle = "";

		newRegion.normalizedRegionTitleObj = {};
		newRegion.normalizedRegionTitleObj.normalizedRegionTitleId = "";
		newRegion.normalizedRegionTitleObj.normalizedRegionTitle = "";

		newRegion.regionUseObj = {
			regionUseId : -1,
			regionUse : "Default"
		};
		newRegion.regionUseArr = [ newRegion.regionUseObj ];

		newRegion.normalizedRegionTitleId = "";
		newRegion.normalizedRegionTitle = "";
		newRegion.isEdited = false;

		return newRegion;
	}

	function loadEditTableData() {

		var branchId = $routeParams.branchId;
		console.log(branchId);

		$http({
			method : "GET",
			url : regionUrl + '/editsbybranch?branchId=' + parseInt(branchId) + "&limit=20&page=1"
		}).then(function(response) {
			console.log(response);
			$scope.editContent = [];
			$scope.editContent = createEditedRegionModel(response.data);
			console.log($scope.editContent);
			$scope.editTableParams = getNgtableParam($scope.editContent);
		}, function(response) {
			console.log("Error Happned while Calling Service");
		});
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

	function loadRegionTitleFilter(regTitle) {

		console.log(regTitle);

		$http({
			method : "GET",
			url : regionUrl + '/titles?key=regiontitle&value' + "&limit=200&page=1"
		}).then(function(response) {
			console.log(response);
			$scope.regionsTitle = response.data.regions;

		});
	}
	;

	$scope.init();

});
