app.controller('createPermissionController',function($scope, $http , $location,$log, $uibModal,$rootScope) {
	$scope.search = function() {
		jQuery(document).ready(function() {
				jQuery(".content-wrapper").css('min-height',jQuery(window).height()- (jQuery('.main-footer').outerHeight() + 
						jQuery('.main-header').outerHeight()));
		});
	};
	$rootScope.hide = true;
	$rootScope.showSideBar = true;
    $scope.actionOnRoles = function(){
    	$location.path("config_action");
    };
    $scope.createRole = function(){
    	$location.path("config_role");
    };
    
    $scope.permissionName='';
	$scope.permissionDesc='';
	 $scope.data = {
	 	      boldTextTitle: "Done",
	 	      textAlert : "Permission created successfully",
	 	      mode : 'success'
	 	    }  
	$scope.addPermission = function(mode) {
		 $scope.data.mode = mode;

	 	    var uibModalInstance = $uibModal.open({
	 	      templateUrl: 'uiModule/userManagement/configurationModule/mymodal.html',
	 	      controller: createPermissionController,
	 	      backdrop: 'static',
	 	      keyboard: false,
	 	      backdropClick: true,
	 	      size: 'lg',
	 	      resolve: {
	 	        data: function () {
	 	          return $scope.data;
	 	        }
	 	      }
	 	    });


	 	    uibModalInstance.result.then(function (selectedItem) {
	 	      $scope.selected = selectedItem;
	 	      $scope.permissionName= '';
	 	      $scope.permissionDesc= '';
	 	    }, function () {
	 	      $log.info('Modal dismissed at: ' + new Date());
	 	    });
		/* $http({
			  url:  'http://172.16.109.36:8080/api-rc-nlp/usermgmt/config/permission/'+ $scope.permissionName,
			  method: "GET",
			   headers : {
				'Content-Type' : 'application/json'
						}
					 }).then(function(response) {
						console.log(response.data);
						 
				 
					}, function(response) {
						//console.log("Error Happned while Calling Service");
					});
		*/
		var request = {
			permissionName: $scope.permissionName,
			permissionDesc: $scope.permissionDesc,
			createdBy : createdBy,
			modifiedBy: modifiedBy
		};
								
		$http({
			url : newPermissionUrl,
			method: "POST",
		    data: angular.toJson(request),					
		    headers : {
								'Content-Type' : 'application/json'
										}
									 }).then(function(response) {
										console.log(response.data);

									}, function(response) {
										//console.log("Error Happned while Calling Service");
									});
				
							};
	 });

var createPermissionController = function ($scope, $uibModalInstance, data) {
	  $scope.data = data;
	  $scope.close = function(/*result*/){
	    $uibModalInstance.close($scope.data);
	  };
	};
