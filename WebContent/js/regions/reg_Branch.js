app.controller('branchListController', function($scope, $http, NgTableParams, $location, $timeout) {

	$scope.myChartObject = {
		type : "PieChart"
	};

	$scope.myChartObject.options = {
		title : 'Edits Chart', is3D : true,
		slices: {
            0: { color: 'green' },
            1: { color: 'red' },
            2: { color: 'orange' }
          }
	};

	$scope.myChartObject.data = {
		"cols" : [ {
			id : "test1", label : "Test1", type : "string"
		}, {
			id : "test2", label : "Test2", type : "string"
		} ], "rows" : [ {
			c : [ {
				v : "PASS"
			}, {
				v : 10
			}, ]
		}, {
			c : [ {
				v : "FAIL"
			}, {
				v : 20
			}, ]
		}, {
			c : [ {
				v : "PROCESS"
			}, {
				v : 30
			}, ]
		} ]
	};

	$scope.testAuditArr = [ {
		branchName : 'Test Branch 1', noOfExits : 10, branchType : 'Regions', testStatus : 'PASS'
	}, {
		branchName : 'Test Branch 2', noOfExits : 20, branchType : 'Dictionaries', testStatus : 'FAIL'
	}, {
		branchName : 'Test Branch 3', noOfExits : 30, branchType : 'Rules', testStatus : 'PROCESS'
	} ]
	$scope.testAuditParams = getNgtableParamNoPaze($scope.testAuditArr);
	

	$scope.searchedContent = [];
	$scope.tableParams = $scope.searchedContent;
	// $scope.branchName = "";
	$scope.isEditing = false;
	$scope.searchedContentEdit = [];
	$scope.deleteCount = 0;
	$scope.currentPage = 0;
	$scope.selectedActionRow = 0;
	$scope.myVar = false;
	$scope.myVar = true;
	$scope.myVarSel = false;
	$scope.cols = "";
	$scope.myErr = false;
	$scope.WorkspaceErr = false;
	$scope.searchKey = "";
	$scope.branchErrMsg = "";

	$scope.statusOptionArr = [ 'Active', 'Discard', 'ReadyToMerge']

	$scope.branchTypeArr = [ 'Region', 'Variant' ]

	$scope.releaseBranches = function() {
		$location.path("commonrelease");
	}
	$scope.search = function() {
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});
		$scope.showError = false;
		$scope.isRewsultEnabled = false;
		$scope.displayAllBranches();

	}

	$scope.addBranch = function() {
		$scope.branchNameRequiredErr = false;
		$scope.branchNameExistErr = false;

		if ($scope.branchName === "" || $scope.branchName === undefined) {
			$scope.branchNameRequiredErr = true;
			$scope.branchNameExistErr = false;
			return;
		} else {
			$scope.branchNameRequiredErr = false;
			$scope.branchNameExistErr = false;

			var request = {
				name : $scope.branchName, userId : 1
			};

			$http({
				url : hostUrl + '/api-rc-nlp/branches', method : "POST", data : angular.toJson(request), headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response.data.branchId);

				if (response.data.message === "Branch name is already exists") {
					console.log($scope.WorkspaceErr);
					$scope.branchNameRequiredErr = false;
					$scope.branchNameExistErr = true;
				} else {
					$scope.WorkspaceErr = false;
					$scope.branchName = "";
					$scope.displayAllBranches();
					$scope.tableParams.reload();
					$scope.tableParams.page(1);
					$scope.tableParams.sorting({});
					$scope.branchNameRequiredErr = false;
					$scope.branchNameExistErr = false;

					$scope.closeAddRegionPopup();
				}
			}, function(response) {
				// console.log("Error Happned
				// while Calling Service");
			});
		}
	};

	$scope.getBranchName = function(obj) {
		localStorage.setItem("dispalyBranchName", obj.target.attributes.data.value);

	}

	$scope.displayAllBranches = function() {
		$scope.isResultEnabled = false;
		var searchCriteria = "";

		if ($scope.searchKey !== '') {
			searchCriteria = '&branchName=' + $scope.searchKey;
		}

		$http({
			url : hostUrl + "/api-rc-nlp/branches?userId=1" + searchCriteria, method : "GET"

		}).then(function(response) {
			console.log(response);
			if (response.data.branches === undefined || response.data.branches.length === 0) {
				flashErrorMsg('searchKeyErrMsg', "No Results found for the given key");
			} else {
				$scope.searchedContent = createUIDataModel(response.data);
				$scope.tableParams = getNgtableParam($scope.searchedContent);
				$scope.searchKey = '';
			}

		}, function(response) {
			flashErrorMsg('searchKeyErrMsg', "Error while making the Request for Search");
		});

	}

	function reloadTableContent(table) {
		// table.reload();
		table.page(1);
		table.sorting({});
	}

	function getNgtableParam(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			page : 1, count : 10, sorting : {}
		}, {
			dataset : data
		});
		return ngtable;
	}

	function getNgtableParamNoPaze(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			count : data.length, sorting : {
				type : "asc"
			}
		}, {
			counts : [], // hide page counts control
			total : 1, // value less than count hide pagination
			dataset : data
		});
		return ngtable;
	}

	function createUIDataModel(data) {
		var results = [];
		var branches = data.branches;
		for (var i = 0; i < branches.length; i++) {
			var branch = branches[i];
			var resBranch = {};
			resBranch.data = branch;
			resBranch.name = branch.name;
			// console.log(branch.branchId);
			resBranch.userId = branch.userId;
			resBranch.statusObj = {
				name : branch.status, value : branch.status
			}
			resBranch.branchTypes = branch.types;
			for (var j = 0; j < branch.types.length; j++) {
				var branchType = branch.types[j];
				if (branchType.type === 'General') {
					resBranch.createdOn = branchType.createdOn;
					resBranch.lastUpdatedOn = branchType.lastUpdatedOn;
					resBranch.status = branchType.status;
					resBranch.rowColor = getBranchRowColor(branchType.status);
					resBranch.branchId = branchType.branchId;
					break;
				}
			}

			/*
			 * resBranch.branchTypes = [{ type : 'Region', editCount : 10 }, {
			 * type : 'Variant', editCount : 20 }];
			 */
			results.push(resBranch);
		}
		return results;
	}
	
	function getBranchRowColor(status){
		[ 'Active', 'Discard', 'ReadyToMerge', 'Merged' ]
		if(status === 'Active'){
			return '';
		}else if(status === 'Discard'){
			return 'btn-danger';
		}else if(status === 'ReadyToMerge'){
			return 'btn-warning';
		}else if(status === 'Merged'){
			return 'btn-success';
		}
		return '';
	}

	$scope.updateStatus = function(branchRow) {
		
		var status = branchRow.status;
		var request = {
			name : branchRow.name, status : branchRow.status
		}

		$http({
			method : "PUT", url : hostUrl + "/api-rc-nlp/branches/" + branchRow.branchId, data : angular.toJson(request), headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			$scope.search();
			
			var message = "";
			if(response.data !== null && response.data !== undefined){
				message = "Status Updated succesfully. ";
				message = message + "Test Status --> Regions :: " + response.data.Regions;
				message = message + ", Dictionaries :: " + response.data.Dictionaries;
			}
			flashErrorMsg('branchErrMsg', message);
		}, function(response) {
			flashErrorMsg('branchErrMsg', "Error while updating the Status");
		});
	};

	$scope.cancel = function(row, rowForm) {
		row.isEditing = false;
		var originalRow = resetRow(row, rowForm);
		angular.extend(row, originalRow);
		$scope.myVar = true;
		$scope.myVarSel = false;

	}

	$scope.navigateToSearch = function(selectedBranchTypeObj) {
		var selectedBranch = {
			branchName : $scope.selectedBranch.name, dictionaryBranchId : "", regionBranchId : ""
		}

		var branchTypeArr = $scope.workspaceTypeParams.data;

		for (var i = 0; i < branchTypeArr.length; i++) {

			var branchTypeModel = branchTypeArr[i];

			if (branchTypeModel.type === 'Regions') {
				selectedBranch.regionBranchId = branchTypeModel.branchId;

			} else if (branchTypeModel.type === 'Dictionaries') {
				selectedBranch.dictionaryBranchId = branchTypeModel.branchId;

			}
		}

		localStorage.setItem("branchName", selectedBranch.branchName);
		localStorage.setItem("dictionaryBranchId", selectedBranch.dictionaryBranchId);
		localStorage.setItem("regionBranchId", selectedBranch.regionBranchId);

		if (selectedBranchTypeObj.type === 'Regions') {
			$location.path("regsearch/" + selectedBranchTypeObj.branchId);
		} else if (selectedBranchTypeObj.type === 'Dictionaries') {
			$location.path("dicsearch/" + selectedBranchTypeObj.branchId);
		}

	}

	function setBranchDetails(branchId, branchName) {
		localStorage.setItem("branchId", branchId);
		localStorage.setItem("branchName", branchName);

	}

	function resetRow(row, rowForm) {
		row.isEditing = false;
		rowForm.$setPristine();
		self.tableTracker.untrack(row);
		return _.findWhere(originalData, function(r) {
			return r.id === row.id;
		});
	}
	$scope.saveChanges = function() {
		$scope.isEditing = false;
		$scope.myVar = true;
		$scope.myVarSel = false;
	};

	$scope.edit = function() {
		$scope.myVar = false;
		$scope.myVarSel = true;
		$scope.isEditing = true;

	};
	$scope.setRowSelection = function(id) {
		$scope.selectedActionRow = id;
	};

	$scope.openAddBranchPopup = function() {

		$scope.branchNameRequiredErr = false;
		$scope.branchNameExistErr = false;

		var popupnrt = jQuery(document).find("#addBranchDialog");
		if (popupnrt.hasClass('hide')) {
			popupnrt.toggleClass("show");
		}
	}

	$scope.openBranchSelectPopup = function(selectedObj) {

		$scope.selectedBranch = selectedObj;
		$scope.workspaceTypeParams = getNgtableParamNoPaze(selectedObj.branchTypes);

		var popupnrt = jQuery(document).find("#branchSelectDialog");
		if (popupnrt.hasClass('hide')) {
			popupnrt.toggleClass("show");
		}
	}

	$scope.closeAddRegionPopup = function() {

		jQuery(document).find("#addBranchDialog").removeClass("show").addClass("hide");

	}

	$scope.closeOpenSearchPopup = function() {

		jQuery(document).find("#branchSelectDialog").removeClass("show").addClass("hide");

	}

	function flashErrorMsg(errModelName, errMsg) {
		$scope[errModelName] = errMsg;
		$timeout(function() {
			$scope[errModelName] = '';
		}, 6000);
	}

	$scope.search();
});
