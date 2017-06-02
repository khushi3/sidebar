app.controller('branchListControllerDictionary', function($scope, $http, NgTableParams) {

	$scope.searchedContent = [];
	$scope.tableParams = getNgtableParam($scope.searchedContent);
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

	$scope.search = function() {
		jQuery(document).ready(
				function() {
					jQuery(".content-wrapper").css('min-height',
							jQuery(window).height() - (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
				});
		$scope.showError = false;
		$scope.isRewsultEnabled = false;
		$scope.displayAllBranches();
	};

	$scope.addBranch = function() {
		// console.log($scope.branchName);
		if ($scope.branchName === "" || $scope.branchName === undefined) {
			// console.log("branchName");
			$scope.myErr = true;
			$scope.WorkspaceErr = false;
		} else {
			$scope.myErr = false;
			$scope.WorkspaceErr = false;
			// branchService.addPBI($scope.branchName).then(function(response) {
			var request = {
				name : $scope.branchName,
				userId : 1
			};

			$http({
				method : "POST",
				url : hostUrl + '/api-rc-nlp/branches/',
				data : angular.toJson(request),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response.data.branchId);

				if (response.data.message === "Branch name is already exists") {
					console.log($scope.WorkspaceErr);
					$scope.WorkspaceErr = true;
				} else {
					$scope.WorkspaceErr = false;
					$scope.branchName = "";
					$scope.displayAllBranches();
					$scope.tableParams.reload();
					$scope.tableParams.page(1);
					$scope.tableParams.sorting({});
				}
			}, function(response) {

			});
		}
	};

	$scope.getBranchName = function(obj) {

		// console.log(obj);

		localStorage.setItem("dispalyBranchName", obj.target.attributes.data.value);

	}

	$scope.displayAllBranches = function() {

		// branchService.getAllWorkspace().then(function(response) {
		// /api/v1/branches/?userid=1
		$http({
			method : "GET",
			url : hostUrl + '/api-rc-nlp/branches/?userId=1'
		}).then(function(response) {
			$scope.searchedContent = createUIDataModel(response.data);

			$scope.tableParams = getNgtableParam($scope.searchedContent);
			console.log($scope.searchedContent);
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			$scope.tableParams.sorting({});

		}, function(response) {
			// console.log("Error Happned while Calling Service");
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
			resBranch.branchId = branch.branchId;
			// console.log(branch.branchId);
			resBranch.userId = branch.userId;
			resBranch.createdOn = branch.createdOn;
			resBranch.lastUpdatedOn = branch.lastUpdatedOn;
			resBranch.status = branch.status;

			results.push(resBranch);
		}
		return results;
	}
	;
	$scope.updateStatus = function(name, seclectedoption, branchId) {
		console.log(seclectedoption);
		if (seclectedoption === "ReadyToMerge") {
			// branchService.updatePBIWorkspace(seclectedoption,
			// branchId).then(function(response){
			var branchid = parseInt(branchId);
			var request = {
				status : seclectedoption
			};

			$http({
				method : "PUT",
				url : hostUrl + '/branches/' + branchid,
				data : angular.toJson(request),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				$scope.search();

				alert(response.data.test_message);
				// jQuery("#modelContainer").show();
				// jQuery("#modelContainer").find("#testresponse").append("<span>"+response.data.test_message
				// +"</span>");
			});

		} else {
			// branchService.statusPBIWorkspace(name,seclectedoption, branchId)
			var branchId = parseInt(branchId);
			var request = {
				name : name,
				status : seclectedoption
			};
			$http({
				method : "POST",
				url : hostUrl + '/branches/' + branchid,
				data : angular.toJson(request),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).then(function(response) {
				console.log(response);
				$scope.search();
				console.log(seclectedoption);
				if (seclectedoption === "active") {
					console.log(jQuery(this));
					jQuery(this).parent().addClass("text");
				} else {
					// console.log(jQuery(this));
					jQuery(this).parent().addClass("pipe");
				}
			});
		}
		;
	}

	// $scope.okModelBtn = function(){//object tye function
	// jQuery("#modelContainer").hide();
	// };
	//	        
	// $scope.cancelModelBtn = function(){
	// jQuery("#modelContainer").hide();
	// };
	//	        
	function getNgtableParam(data) {
		$scope.data = data;
		var ngtable = new NgTableParams({
			page : 1,
			count : 5,
			sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}

	$scope.cancel = function(row, rowForm) {
		row.isEditing = false;
		var originalRow = resetRow(row, rowForm);
		angular.extend(row, originalRow);
		$scope.myVar = true;
		$scope.myVarSel = false;

	};
	function resetRow(row, rowForm) {// need to call
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

	$scope.edit = function(selectedActionRow) {

		if ($scope.selectedActionRow != null) {
			$scope.myVar = false;
			$scope.myVarSel = true;
			$scope.isEditing = true;
			var varient = $scope.searchedContentEdit[$scope.selectedActionRow];

			// varient.isEditing = true;
		}
		// $scope.isEditing = true;

	};
	$scope.setRowSelection = function(id) {
		$scope.selectedActionRow = id;
	};
	$scope.search();
});
