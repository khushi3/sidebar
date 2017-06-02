app.controller('dicTestStatusController', function($scope, $http, NgTableParams, $location, $routeParams, $timeout) {
	
	$scope.testResponse;
	$scope.testRequest = getDictTestData();
	$scope.workingStatus = true;
	$scope.selectedBranchName = localStorage.getItem("branchName");
	
	$scope.goBack = function() {
		window.history.back();

	}
	
	function postEditsForTest(testRequest) {
		$http({
			method : "PUT",
			url : variantUrl + '/tests/' + $routeParams.testId + '?type=json',
			data : angular.toJson(testRequest),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).then(function(response) {
			console.log(response);
			$scope.showTestStatus = true;
			$scope.testResponse = response;
			$scope.workingStatus = false;
		}, function(response) {
			console.log("Error while submitting to the Test Service");
			$scope.showTestStatus = true;
			$scope.testResponse = response;
			$scope.workingStatus = false;
		});
		
	}
	
	postEditsForTest($scope.testRequest);
	
});
