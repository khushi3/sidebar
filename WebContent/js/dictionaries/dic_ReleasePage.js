app.controller('releasePageController', function($scope, $http, NgTableParams) {

	$scope.searchedContent = [];
	$scope.tableParams = getNgtableParam($scope.searchedContent);
	// $scope.branchName = "";
	$scope.isEditing = false;
	$scope.searchedContentEdit = [];
	$scope.deleteCount = 0;
	$scope.currentPage = 0;
	$scope.selectedActionRow = 0;
	$scope.checked_branchId = [];
	$scope.relStatus = "major";
	$scope.myVar = false;
	$scope.myVar = true;
	$scope.myVarSel = false;
	$scope.cols = "";
	$scope.comments = "";
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

	$scope.displayAllBranches = function() {

		// releaseContent.getReleased().
		$http({
			method : "GET", url : hostUrl + "/branches/ready?userId=1"
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
	$scope.releaseStatus = function(releasedStatus) {
		$scope.relStatus = releasedStatus;

	};
	jQuery(function() {
		jQuery("#responsedata").draggable();
	});

	function getNgtableParam(data) {
		var ngtable = new NgTableParams({
			page : 1, count : 5, sorting : {
				name : "asc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}
	;

	$scope.release = function() {
		console.log($scope.relStatus);
		console.log($scope.checked_branchId);
		var chkBox = $scope.checked_branchId;
		var getBoxs = chkBox.map(Number);
		console.log(getBoxs);
		var releaseData = [];
		releaseData.push($scope.comments);
		// releaseContent.releaseTest($scope.relStatus,$scope.checked_branchId,$scope.comments).then(function(response){
		var branch = [];
		branch = branchIds;
		console.log(branchIds);
		var getBid = branch.map(Number);
		console.log(getBid);

		var request = {
			"branchIds" : getBid, "key" : $scope.relStatus, "comment" : $scope.comments
		};

		$http({
			method : "POST", url : hostUrl + '/variants/releases/move/', data : angular.toJson(request), headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			console.log(response);
			var msg = response.data.message;
			jQuery("#responsedata").empty();
			var warning;
			var displayBranchName = [];

			if (response.data.conflicts !== undefined) {
				var partsOfStr = msg.split(':');
				warning = partsOfStr[0];
				console.log(partsOfStr[0]);
				console.log(partsOfStr[1]);
			} else {
				warning = " ";
			}

			if (warning === "Warning") {
				console.log(response);
				var respBranchname = response.data.conflicts;
				for (var i = 0; i < respBranchname.length; i++) {
					displayBranchName.push(respBranchname[i].branchName);
				}
				jQuery(responsedata).removeAttr("class");
				jQuery(responsedata).addClass("alert alert-warning");
				jQuery("table#relId tbody tr").removeAttr("class");
				jQuery("table#relId tbody tr td  input[type='checkbox']").each(function(value) {
					var chk = jQuery(this).is(':checked');
					console.log(chk);
					var respBranchname = response.data.conflicts;
					if (chk === true) {
						console.log(jQuery(this).parent());
						console.log(jQuery(this).parent().parent().parent());
						jQuery(this).parent().parent().parent().addClass("alert alert-warning");
					} else {
						jQuery(this).parent().parent().parent().removeAttr("class");

					}

				});

				console.log(displayBranchName);
			} else if (msg === "Successfully released") {
				displayBranchName = "";
				jQuery(responsedata).removeAttr("class");
				jQuery(responsedata).addClass("alert alert-success");
				jQuery("table#relId tbody tr").removeAttr("class");
				jQuery("table#relId tbody tr td  input[type='checkbox']").each(function(value) {
					var chk = jQuery(this).is(':checked');
					console.log(chk);

					if (chk === true) {
						console.log(jQuery(this).parent());
						console.log(jQuery(this).parent().parent().parent());
						jQuery(this).parent().parent().parent().addClass("alert alert-success");
					} else {
						jQuery(this).parent().parent().parent().removeAttr("class");

					}

				});
			} else {
				var respBranchname = response.data.conflicts;
				for (var i = 0; i < respBranchname.length; i++) {
					displayBranchName.push(respBranchname[i].branchName);
				}
				jQuery(responsedata).removeAttr("class");
				jQuery(responsedata).addClass("alert alert-danger");
				jQuery("table#relId tbody tr").removeAttr("class");
				jQuery("table#relId tbody tr td  input[type='checkbox']").each(function(value) {
					var chk = jQuery(this).is(':checked');
					console.log(chk);

					if (chk === true) {
						console.log(jQuery(this).parent());
						console.log(jQuery(this).parent().parent().parent());
						jQuery(this).parent().parent().parent().addClass("alert alert-danger");
					} else {
						jQuery(this).parent().parent().parent().removeAttr("class");

					}

				});
			}

			jQuery("#responsedata").append(response.data.message + " " + displayBranchName);
		});
	};

	// $scope.setRowSelection = function(id)
	// {
	// $scope.selectedActionRow = id;
	// };
	$scope.search();
	app.directive('checkBranch', function() {
		return {
			scope : {
				list : '=checkBranch', value : '@'
			}, link : function(scope, elem, attrs) {
				var handler = function(setup) {
					var checked = elem.prop('checked');
					var index = scope.list.indexOf(scope.value);

					if (checked && index == -1) {
						if (setup)
							elem.prop('checked', false);
						else
							scope.list.push(scope.value);
					} else if (!checked && index != -1) {
						if (setup)
							elem.prop('checked', true);
						else
							scope.list.splice(index, 1);
					}
				};

				var setupHandler = handler.bind(null, true);
				var changeHandler = handler.bind(null, false);

				elem.on('change', function() {
					scope.$apply(changeHandler);
				});
				scope.$watch('list', setupHandler, true);
			}
		};
	});
});
