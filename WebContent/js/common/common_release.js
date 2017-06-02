app.controller('commonReleaseController', function($scope, $http, NgTableParams, $timeout, $location) {

	$scope.searchedContent = [];
	$scope.tableParams = $scope.searchedContent;
	$scope.isEditing = false;
	$scope.searchedContentEdit = [];
	$scope.deleteCount = 0;
	$scope.currentPage = 0;
	$scope.selectedActionRow = 0;
	$scope.myVarSel = false;
	$scope.cols = "";
	$scope.WorkspaceErr = false;
	$scope.searchKey = "";
	$scope.seclectedVersion = "major";
	$scope.releaseComments = "";

	$scope.statusOptionArr = [ 'Active', 'Discard', 'ReadyToMerge', 'Merged' ]

	$scope.branchTypeArr = [ 'Region', 'Variant' ]

	$scope.goBack = function() {
		$location.path("regbranch/");
	}
	
	$scope.releaseBranches = function() {
		var branchRecordArr = $scope.tableParams.data;
		var brnchIdArr = [];
		for(var i=0;i <branchRecordArr.length;i++){
			var branchRec = branchRecordArr[i];
			if(branchRec.isSelected){
				brnchIdArr.push(parseInt(branchRec.branchId))
			}
		}
		
		if(brnchIdArr.length === 0){
			flashErrorMsg('editErrorMsg', "Please select atleast one branch to release");
			return;
		}
		if($scope.releaseComments === ""){
			flashErrorMsg('editErrorMsg', "Please provide comments");
			return;
		}
		var payload = {
			branchIds : brnchIdArr,
			comments : $scope.releaseComments
		}
		
		$http({
			method : "POST", url : branchUrl + "/releases/move/?key="+$scope.seclectedVersion, data : payload, headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			flashErrorMsg('editErrorMsg', "Released successfully");
			alert("Released successfully");
			$location.path("regbranch/");
		}, function(response) {
			flashErrorMsg('editErrorMsg', "Error while Deleting the Record");
		});
	}
	
	function flashErrorMsg(errModelName, errMsg) {
		$scope[errModelName] = errMsg;
		$timeout(function() {
			$scope[errModelName] = '';
		}, 3000);
	}

	
	$scope.search = function() {
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});
		$scope.displayAllBranches();
	}

	$scope.displayAllBranches = function() {
		$scope.isResultEnabled = false;
		var searchCriteria = "";

		if ($scope.searchKey !== '') {
			searchCriteria = '&branchName=' + $scope.searchKey;
		}

		$http({
			url : hostUrl + "/api-rc-nlp/branches/ready?userId=1" + searchCriteria,
			method : "GET"

		}).then(function(response) {
			console.log(response);
			if (response.data.branches === undefined || response.data.branches.length === 0) {
				flashErrorMsg('searchKeyErrMsg', "No Results found for the given key");
			} else {
				$scope.searchedContent = createUIDataModel(response.data);
				$scope.tableParams = getNgtableParamNoPaze($scope.searchedContent);
				$scope.searchKey = '';
			}

		}, function(response) {
			flashErrorMsg('searchKeyErrMsg', "Error while making the Request for Search");
		});

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
				name : branch.status,
				value : branch.status
			}
			resBranch.isSelected = false;
			resBranch.branchTypes = branch.types;
			for (var j = 0; j < branch.types.length; j++) {
				var branchType = branch.types[j];
				if (branchType.type === 'General') {
					resBranch.createdOn = branchType.createdOn;
					resBranch.lastUpdatedOn = branchType.lastUpdatedOn;
					resBranch.status = branchType.status;
					resBranch.branchId = branchType.branchId;
					break;
				}
			}

			results.push(resBranch);
		}
		return results;
	}

	function getNgtableParamNoPaze(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			count : data.length,
			sorting : {
				type : "asc"
			}
		}, {
			counts : [], // hide page counts control
			total : 1, // value less than count hide pagination
			dataset : data
		});
		return ngtable;
	}

	$scope.search();

});
