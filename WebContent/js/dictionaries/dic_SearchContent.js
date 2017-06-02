app.controller('varientGroupController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {
	$scope.selectedBranchId = $routeParams.branchId;
	$scope.selectedBranchName = localStorage.getItem("branchName");

	$scope.tableParams;
	$scope.searchedContent = [];
	$scope.editContent = [];
	$scope.clonedContent = [];
	$scope.editErrorMsg = '';
	$scope.searchKeyErrMsg = '';
	$scope.cuiOfXpressAdd = '';
	$scope.xpressTableParams;
	$scope.seclectedKey = "varString";
	$scope.xpressAddObj = {
		dictionary : '', cui : '', tui : '', ncid : ''
	};

	$scope.navigateToWorkspace = function() {
		setRegionWorkspaceIds(null);
		$location.path("commonworkspace");
	}

	$scope.init = function() {

		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});

		loadEditTableData();

	}

	$scope.revertEdited = function(editObj) {
		var request = {
			editId : editObj.editId, action : "Delete"
		}

		$http({
			method : "POST", url : variantUrl, data : [ request ], headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			loadEditTableData();
			flashErrorMsg('editErrorMsg', "Deleted the Record Successfully");
		}, function(response) {
			flashErrorMsg('editErrorMsg', "Error while Deleting the Record");
		});
	}

	$scope.search = function() {

		if ($scope.searchKey === "" || $scope.searchKey === undefined) {
			flashErrorMsg('mainErrorMsg', "Please Enter Search Vaue");
			return;
		} else if ($scope.seclectedKey === "" || $scope.seclectedKey === undefined) {
			flashErrorMsg('mainErrorMsg', "Please Select a  Search Key");
			return;
		}

		if ($scope.searchKey) {
			$http({
				method : "GET", url : variantUrl + '?key=' + $scope.seclectedKey + "&value=" + $scope.searchKey + "&limit=2500" + "&page=1"
			}).then(function(response) {

				$scope.isResultEnabled = false;

				$scope.searchedContent = createMainDataModelArray(response.data);

				if ($scope.searchedContent.length > 0) {
					$scope.isResultEnabled = true;
					$scope.tableParams = getNgtableParamGroupByDict($scope.searchedContent);
				} else {
					flashErrorMsg('mainErrorMsg', "No result Found !!!");
					$scope.isResultEnabled = false;
				}
			}, function(response) {
				console.log("Error Happned while Calling Service");
				$scope.myErrr = false;
				flashErrorMsg('mainErrorMsg', "Error Happend wile getting the Records !!!");
			});

		} else {
			$scope.tableParams = getNgtableParamGroupByDict($scope.searchedContent);
			reloadTableContent($scope.tableParams);
		}

	}

	$scope.cloneRow = function(selectedRowObj) {

		var clonedObj = cloneObject(selectedRowObj);
		clonedObj.isEditing = false;
		clonedObj.isEdited = false;
		clonedObj.action = "Edit";
		clonedObj.rowId = $scope.editContent.length;
		clonedObj.isSelected = false;

		copyToEditFields(clonedObj);

		$scope.editContent.push(clonedObj);
		$scope.clonedContent.push(clonedObj);

		$scope.editTableParams = getNgtableParam($scope.editContent);

	}

	$scope.addNewRecord = function() {
		var newModel = createEmptyModel();

		newModel.rowId = $scope.editContent.length;
		newModel.isEditing = false;
		newModel.isEdited = false;
		newModel.action = "Add";

		$scope.editContent.push(newModel);
		$scope.clonedContent.push(newModel);

		$scope.editTableParams = getNgtableParam($scope.editContent);
	}

	$scope.deleteRow = function(selectedObj) {

		var clonedObj = cloneObject(selectedObj);
		clonedObj.action = "Delete";
		clonedObj.rowId = $scope.editContent.length;
		copyToEditFields(clonedObj);

		$scope.editContent.push(clonedObj);
		$scope.clonedContent.push(clonedObj);

		$scope.editTableParams = getNgtableParam($scope.editContent);
		$scope.searchTableParams = getNgtableParam($scope.searchedContent);

		$scope.saveEdit(clonedObj);
	}

	$scope.saveAddList = function(addObjList) {

		var branchId = parseInt($routeParams.branchId);

		var addRequestList = [];
		for (var i = 0; i < addObjList.length; i++) {

			var addObj = addObjList[i];
			var request = {
				metadata : {
					dictionary : addObj.dictionary, varString : addObj.varString, ncid : addObj.cui, cui : addObj.cui, tui : addObj.tui
				}, action : "Add", branchId : branchId,
			}

			addRequestList.push(request);
		}

		$http({
			method : "POST", url : variantUrl, data : addRequestList, headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			loadEditTableData();
			$scope.closePopupDialogue('#xpressAddDialog');

		}, function(response) {
			flashErrorMsg('editErrorMsg', "Error while Saving the Boilerplate");
			$scope.closePopupDialogue('#xpressAddDialog');
		});

	}

	$scope.saveEdit = function(selectedRowObj) {

		if (selectedRowObj.editDictionary === '' || selectedRowObj.editVarString === '') {
			flashErrorMsg('editErrorMsg', "Please provide Dictionary/Variant Value. It is required");
			return;
		}

		var branchId = parseInt($routeParams.branchId);

		var request = {

			"metadata" : {
				"dictionary" : selectedRowObj.editedDictionary, "variantId" : selectedRowObj.variantId, "varString" : selectedRowObj.editedVarString,
				"ncid" : selectedRowObj.editedNcid, "cui" : selectedRowObj.editedCui, "tui" : selectedRowObj.editedTui
			}, "action" : selectedRowObj.action, "branchId" : branchId,
		}

		if (selectedRowObj.isEdited) {
			request.editId = selectedRowObj.editId;
		} else {
			removeClonedRecord(selectedRowObj.rowId);
		}

		$http({
			method : "POST", url : variantUrl, data : [ request ], headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			flashErrorMsg('editErrorMsg', "Saved the Record Successfully");
			loadEditTableData();

		}, function(response) {
			flashErrorMsg('editErrorMsg', "Error while Saving the Boilerplate");
		});

	}

	$scope.editRow = function(selectedObj) {
		selectedObj.isEditing = true
	}

	$scope.cancelEdit = function(selectedObj) {
		selectedObj.isEditing = false;
	}

	$scope.openPopupDialogue = function(popupId) {

		$scope.branchNameRequiredErr = false;
		$scope.branchNameExistErr = false;

		var popupnrt = jQuery(document).find(popupId);
		if (popupnrt.hasClass('hide')) {
			popupnrt.toggleClass("show");
		}
	}

	$scope.closePopupDialogue = function(popupId) {

		jQuery(document).find(popupId).removeClass("show").addClass("hide");
	}

	$scope.saveXpressRecords = function() {
		var xpressTableDataArr = $scope.xpressTableParams.data;
		var addedRecordArr = [];

		if ($scope.xpressAddObj.dictionary === undefined || $scope.xpressAddObj.cui === undefined || $scope.xpressAddObj.dictionary === ''
				|| $scope.xpressAddObj.cui === '') {
			flashErrorMsg('xpressErrorMsg', "Dictionary and CUI fields are Mandatory");
			return;
		}

		for (var i = 0; i < xpressTableDataArr.length; i++) {
			var xpressTableRecord = xpressTableDataArr[i];

			if (xpressTableRecord.varString !== '') {
				var xpressRecord = cloneObject($scope.xpressAddObj);
				xpressRecord.varString = xpressTableRecord.varString;
				addedRecordArr.push(xpressRecord);
			}
		}

		if (addedRecordArr.length === 0) {
			flashErrorMsg('xpressErrorMsg', "Please provide atleast one Variant to add");
			return;
		}

		if (addedRecordArr.length > 0) {
			$scope.saveAddList(addedRecordArr);
		}
	}

	$scope.openXpressData = function() {
		$scope.cuiOfXpressAdd = '';
		resetXpressAddTableParams();
		resetXpressAddObj();
		$scope.openPopupDialogue('#xpressAddDialog');
	}

	function resetXpressAddObj() {
		$scope.xpressAddObj = {
			dictionary : '', cui : '', tui : '', ncid : ''
		};
	}

	function removeClonedRecord(rowId) {
		for (var i = 0; i < $scope.clonedContent.length; i++) {
			if ($scope.clonedContent[i].rowId == rowId) {
				$scope.clonedContent.splice(i, 1);
				break;
			}
		}
	}

	function loadEditTableData() {

		var branchId = parseInt($routeParams.branchId);
		console.log(branchId);

		$http({
			method : "GET", url : variantUrl + '/edits?branchId=' + branchId + "&limit=20&page=1"
		}).then(function(response) {
			console.log(response);
			$scope.editContent = createEditedDataModelArray(response.data);
			console.log($scope.editContent);
			$scope.isResultEnabled = true;
			$scope.editTableParams = getNgtableParam($scope.editContent);
		}, function(response) {
			console.log("Error Happned while Calling Service");
		});
	}

	function createEditedDataModelArray(data) {
		var results = [];

		var responseObjArr = data.edits;
		for (var i = 0; i < responseObjArr.length; i++) {
			var responseModel = createBasicDataModel(responseObjArr[i].metadata);

			responseModel.rowId = i;
			responseModel.isEditing = false;
			responseModel.isEdited = true;
			responseModel.editId = responseObjArr[i].editId;
			responseModel.action = responseObjArr[i].action;
			responseModel.testId = responseObjArr[i].testId;
			responseModel.isSelected = false;
			responseModel.status = responseObjArr[i].status;

			copyToEditFields(responseModel)

			results.push(responseModel);
		}

		var editedRecordsLength = results.length;
		for (var i = 0; i < $scope.clonedContent.length; i++) {
			var clonedObj = $scope.clonedContent[i];
			clonedObj.rowId = i + editedRecordsLength;
			results.push(clonedObj);
		}

		return results;
	}

	function createMainDataModelArray(data) {

		var results = [];
		var responseArr = data.variants;
		for (var i = 0; i < responseArr.length; i++) {
			var responseModel = createBasicDataModel(responseArr[i]);
			responseModel.data = responseArr[i];
			responseModel.rowId = i;

			results.push(responseModel);
		}
		return results;
	}

	function createBasicDataModel(responseObj) {
		var basicModel = {};

		basicModel.variantId = responseObj.variantId;
		basicModel.dictionary = responseObj.dictionary;
		basicModel.varString = responseObj.varString;

		basicModel.ncid = responseObj.ncid;
		basicModel.cui = responseObj.cui;
		basicModel.tui = responseObj.tui;

		var props = responseObj.props;
		if (props !== undefined && props.length > 0) {
			for (var i = 0; i < props.length; i++) {
				var prop = props[i];
				if (prop.name === 'cui') {
					basicModel.cui = prop.value;
				} else if (prop.name === 'ncid') {
					basicModel.ncid = prop.value;
				} else if (prop.name === 'tui') {
					basicModel.tui = prop.value;
				}
			}
		}

		return basicModel;
	}

	function createEmptyModel() {
		var newModel = {};
		resetModelData(newModel);
		copyToEditFields(newModel);
		return newModel;
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

	function reloadTableContent(table) {
		table.reload();
		table.page(1);
		table.sorting({});
	}

	function getNgtableParam(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			page : 1, count : 5, sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}

	function getNgtableParamGroupByDict(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			page : 1, count : 5, group : {
				dictionary : "desc"
			}, sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}

	function getNgtableParamNoPaze(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			count : data.length, sorting : {
				name : "desc"
			}
		}, {
			counts : [], // hide page counts control
			total : 1, // value less than count hide pagination
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

	function copyToEditFields(modelObj) {

		modelObj.editedVariantId = modelObj.variantId;
		modelObj.editedDictionary = modelObj.dictionary;
		modelObj.editedVarString = modelObj.varString;
		modelObj.editedNcid = modelObj.ncid;
		modelObj.editedCui = modelObj.cui;
		modelObj.editedTui = modelObj.tui;

	}

	function resetModelData(modelObj) {

		modelObj.variantId = '';
		modelObj.dictionary = '';
		modelObj.varString = '';
		modelObj.ncid = '';
		modelObj.cui = '';
		modelObj.tui = '';
	}

	function resetXpressAddTableParams() {
		var xpressTableModelArr = [];
		for (var i = 0; i < 10; i++) {
			var emptyModel = {};
			resetModelData(emptyModel);
			emptyModel.action = 'Add';
			xpressTableModelArr.push(emptyModel);
		}
		$scope.xpressTableParams = getNgtableParamNoPaze(xpressTableModelArr);
	}

	$scope.searchtabClick = function() {
		$location.path("regsearch");
	}

	$scope.maptabClick = function() {
		$location.path("regmapping");
	}

	$scope.init();

});
