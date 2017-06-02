app.controller('boilerSearchController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {
	$scope.selectedBranchId = $routeParams.branchId;
	$scope.selectedBranchName = localStorage.getItem("branchName");
	$scope.tableParams;
	$scope.searchedContent = [];
	$scope.editContent = [];
	$scope.clonedContent = [];
	$scope.editErrorMsg = '';
	$scope.searchKeyErrMsg = '';

	$scope.init = function() {// called to aviod page container issue

		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});

		loadEditTableData();

	}

	$scope.search = function() {

		$scope.myErrr = false;
		if ($scope.searchKey === "" || $scope.searchKey === undefined) {
			flashErrorMsg('searchKeyErrMsg', "Please Enter Search Key");
		} else {
			$scope.myErrr = false;
			if ($scope.seclectedKey === "" || $scope.seclectedKey === undefined) {
				$scope.seclectedKey = "description";
			}
			if ($scope.searchKey) {
				$http({
					method : "GET",
					url : hostUrl + '/api-rc-nlp/regions/boilerplates?value=' + $scope.searchKey + "&page=1&limit=170"
				}).then(function(response) {
					$scope.isResultEnabled = false;

					$scope.searchedContent = createBoilerUIDataModel(response.data);

					if ($scope.searchedContent.length > 0) {
						$scope.isResultEnabled = true;
						$scope.myErrr = false;
						$scope.tableParams = getNgtableParam($scope.searchedContent);
						$scope.tableParams.reload();
						$scope.tableParams.page(1);
						$scope.tableParams.sorting({});
					} else {
						$scope.myErrr = false;
						flashErrorMsg('searchKeyErrMsg', "No result Found !!!");
						$scope.isResultEnabled = false;
					}
				}, function(response) {
					console.log("Error Happned while Calling Service");
					$scope.myErrr = false;
					flashErrorMsg('searchKeyErrMsg', "Error Happend wile getting the Records !!!");
				});

			} else {
				$scope.tableParams = getNgtableParam($scope.searchedContent);
				reloadTableContent($scope.tableParams);
			}

		}
	}

	$scope.cloneRow = function(index) {

		var selectedObj = $scope.searchedContent[index];

		var clonedSelectedObj = cloneObject(selectedObj);
		clonedSelectedObj.isEditing = false;
		clonedSelectedObj.isEdited = false;
		clonedSelectedObj.action = "Edit";
		clonedSelectedObj.rowId = $scope.editContent.length;

		copyToEditFields(clonedSelectedObj);
		clonedSelectedObj.parentBoilerplateId = clonedSelectedObj.boilerplateRegionId;

		$scope.editContent.push(clonedSelectedObj);
		$scope.clonedContent.push(clonedSelectedObj);

		$scope.editTableParams = getNgtableParam($scope.editContent);

	}

	function copyToEditFields(boilerObj) {

		boilerObj.editedBoilerplateRegionId = boilerObj.boilerplateRegionId;
		boilerObj.editedStart = boilerObj.start;
		boilerObj.editedStartRegex = boilerObj.startRegex;
		boilerObj.editedEndRegex = boilerObj.endRegex;
		boilerObj.editedEnd = boilerObj.end;
		boilerObj.editedWholePhrase = boilerObj.wholePhrase;
		boilerObj.editedWholePhraseRegex = boilerObj.wholePhraseRegex;
		boilerObj.editedExactWhitespace = boilerObj.exactWhitespace;
	}

	function resetBoilerplateData(boilerObj) {

		boilerObj.start = '';
		boilerObj.startRegex = false;
		boilerObj.endRegex = false;
		boilerObj.end = '';
		boilerObj.wholePhrase = '';
		boilerObj.wholePhraseRegex = false;
		boilerObj.exactWhitespace = false;
		copyToEditFields(boilerObj);
	}

	$scope.addNewRecord = function() {
		var newObj = createEmptyRecord();

		newObj.rowId = $scope.editContent.length;
		newObj.isEditing = false;
		newObj.isEdited = false;
		newObj.action = "Add";

		$scope.editContent.push(newObj);
		$scope.clonedContent.push(newObj);

		$scope.editTableParams = getNgtableParam($scope.editContent);
	}

	$scope.deleteRow = function(index) {

		var selectedObj = $scope.searchedContent[index];
		selectedObj.index = index;
		selectedObj.action = "Delete";
		selectedObj.rowId = $scope.editContent.length;

		$scope.editContent.push(selectedObj);
		$scope.clonedContent.push(selectedObj);

		$scope.editTableParams = getNgtableParam($scope.editContent);
		$scope.searchTableParams = getNgtableParam($scope.searchedContent);

		$scope.saveBoilerplate(selectedObj);
	}

	$scope.saveBoilerplate = function(boilerObj) {

		if (boilerObj.editedStart === '' && boilerObj.editedEnd === '' && boilerObj.editedWholePhrase === '') {
			flashErrorMsg('editErrorMsg', "Please provide any or all of Start/End/WholePhrase Values");
			return;
		}

		var branchId = parseInt($routeParams.branchId);

		var request = {
			start : boilerObj.editedStart,
			end : boilerObj.editedEnd,
			startRegex : boilerObj.editedStartRegex,
			endRegex : boilerObj.editedEndRegex,
			wholePhrase : boilerObj.editedWholePhrase,
			wholePhraseRegex : boilerObj.editedWholePhraseRegex,
			exactWhitespace : boilerObj.editedExactWhitespace,
			parentBoilerplateId : boilerObj.parentBoilerplateId,
			action : boilerObj.action
		}
		if (boilerObj.isEdited) {
			request.boilerplateRegionId = boilerObj.boilerplateRegionId
		} else {
			removeClonedRecord(boilerObj.regionId);
		}

		$http({
			method : "POST",
			url : regionUrl + '/brnachboilerplates?branchId=' + branchId,
			data : request,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			loadEditTableData();

		}, function(response) {
			flashErrorMsg('editErrorMsg', "Error while Saving the Boilerplate");
		});

	}

	function removeClonedRecord(regionId) {
		for (var i = 0; i < $scope.clonedContent.length; i++) {
			if ($scope.clonedContent[i].regionId == regionId) {
				$scope.clonedContent.splice(i, 1);
				break;
			}
		}
	}

	function loadEditTableData() {

		var branchId = parseInt($routeParams.branchId);
		console.log(branchId);

		$http({
			method : "GET",
			url : regionUrl + '/brnachboilerplates?branchId=' + branchId + "&limit=20&page=1"
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

	function createEditedRegionModel(data) {
		var results = [];
		var boilerPlateDataArr = data.boilerplates;
		for (var i = 0; i < boilerPlateDataArr.length; i++) {
			var responseObj = boilerPlateDataArr[i];
			var responseModel = {};

			responseModel.data = responseObj;
			responseModel.rowId = i;
			responseModel.boilerplateRegionId = responseObj.boilerplateRegionId;
			responseModel.endRegex = responseObj.endRegex;
			responseModel.start = responseObj.start;

			responseModel.startRegex = responseObj.startRegex;
			responseModel.wholePhrase = responseObj.wholePhrase;
			responseModel.exactWhitespace = responseObj.exactWhitespace;
			responseModel.end = responseObj.end;
			responseModel.wholePhraseRegex = responseObj.wholePhraseRegex;
			responseModel.parentBoilerplateId = responseObj.parentBoilerplateId;

			responseModel.isEditing = false;
			if (responseObj.isEdited !== undefined && responseObj.isEdited === false) {
				responseModel.isEdited = false;
			} else {
				responseModel.isEdited = true;
			}

			responseModel.action = responseObj.action;
			copyToEditFields(responseModel)

			results.push(responseModel);
		}

		var editedRecordsLength = results.length;
		for (var i = editedRecordsLength; i < $scope.clonedContent.length + editedRecordsLength; i++) {
			var clonedObj = $scope.clonedContent[i];
			clonedObj.rowId = i;
			results.push(clonedObj);
		}
		return results;
	}

	function createEmptyRecord() {
		var newObj = {};
		resetBoilerplateData(newObj);
		return newObj;
	}

	function cloneObject(obj) {
		if (null == obj || "object" != typeof obj)
			return obj;
		console.log(obj);
		var copy = obj.constructor();

		for ( var attr in obj) {

			if (obj.hasOwnProperty(attr))
				copy[attr] = obj[attr];
		}

		return copy;
	}

	function createBoilerUIDataModel(data) {
		var results = [];
		var responseArr = data.regions;
		for (var i = 0; i < responseArr.length; i++) {
			var responseObj = responseArr[i];
			var responseModel = {};
			responseModel.data = responseObj;

			responseModel.rowId = i;
			responseModel.boilerplateRegionId = responseObj.boilerplateRegionId;
			responseModel.endRegex = responseObj.endRegex;
			responseModel.start = responseObj.start;

			responseModel.startRegex = responseObj.startRegex;
			responseModel.wholePhrase = responseObj.wholePhrase;
			responseModel.exactWhitespace = responseObj.exactWhitespace;
			responseModel.end = responseObj.end;
			responseModel.wholePhraseRegex = responseObj.wholePhraseRegex;

			results.push(responseModel);
		}
		return results;
	}

	$scope.editRow = function(selectedObj) {
		selectedObj.isEditing = true
	}

	$scope.cancelEdit = function(selectedObj) {
		selectedObj.isEditing = false;
	}

	function reloadTableContent(table) {
		table.reload();
		table.page(1);
		table.sorting({});
	}

	function getNgtableParam(data) {
		var ngtable = new NgTableParams({
			page : 1,
			count : 10,
			sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}

	function flashErrorMsg(errModelName, errMsg) {
		$scope[errModelName] = errMsg;
		$timeout(function() {
			$scope[errModelName] = '';
		}, 3000);
	}

	$scope.searchtabClick = function() {
		$location.path("regsearch");
	}

	$scope.maptabClick = function() {
		$location.path("regmapping");
	}

	$scope.init();

});