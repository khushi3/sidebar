app.controller('commonWorkspaceController', function($scope, $http, NgTableParams) {
	
	$scope.regionScope = {};
	$scope.dictScope = {};
	$scope.comments = "";
	
	$scope.regionSubmitForTest = function() {
		$scope.regionScope.submitForTest();
	}
	
	$scope.dictSubmitForTest = function() {
		$scope.dictScope.submitForTest();
	}
	
});
