 	 app.controller('configRoleController', function($scope,$http,$location,$log, $uibModal,$rootScope) {
 		 $rootScope.showSideBar = true;
	       /* actions for navigation tab on Roles and Permission*/
		    $scope.actionOnRoles = function(){
		    	$location.path("config_action");
		    };
		    $scope.createPermission = function(){
		    	$location.path("create_permission");
		 };
		    
			 $scope.permissionmodel = []; 
		     $scope.permission = [];
		     $http({
     			url : getAllPermissionsUrl,
     			method : "GET"

     		}).then(function (response){
     			console.log(response.data.permissions);
     			response.data.permissions.map(function(item){
     				console.log(item.permissionName)
     				item.label= item.permissionName,
     				item.id= item.permissionId
     			});
     			$scope.permission= response.data.permissions;
     			//console.log($scope.permission);
     		})
	 
             $scope.settings = { buttonClasses: 'btn', scrollable: true ,scrollableHeight: '165px', enableSearch: true };
		     $scope.roles=[];
		     $scope.roleDescription=[];
		     $scope.data = {
	    	 	      boldTextTitle: "Done",
	    	 	      textAlert : "Roles created successfully",
	    	 	      mode : 'success'
	    	 	    } 
		     /*function to show success message on modal popup*/
		     $scope.assignPermission = function(mode){
		    	   $scope.data.mode = mode;

	    	 	    var uibModalInstance = $uibModal.open({
	    	 	      templateUrl: 'uiModule/userManagement/configurationModule/mymodal.html',
	    	 	      controller: configRoleController,
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
                    /* Reset function on close of success modal*/
	    	 	    uibModalInstance.result.then(function (selectedItem) {
	    	 	      $scope.selected = selectedItem;
	    	 		 $scope.permissionmodel= [];
			    	 $scope.roleName= '';
			    	 $scope.roleDescription= '';
	    	 	        //alert( $scope.selected);
	    	 	    }, function () {
	    	 	      $log.info('Modal dismissed at: ' + new Date());
	    	 	    });

		    	 var currDate = new Date().toJSON();
		    		 $http({
		    		        url:  newRoleUrl,
		    		        headers : {
		   		    		 'Content-Type' : 'application/json'
		   		    		 },
		    		        method: "POST",
		    		        data:{
		    		            "roleName": $scope.roleName,
		    		            "roleDesc": $scope.roleDescription,
		    		            "permissions": $scope.permissionmodel,
		    		            "createdBy" : createdBy,
								"modifiedBy": modifiedBy
		    		          }
		    		
		    		    }).then(function(response) {
		    		        console.log(response);
		    		       

		    		 }, function(response) {
		    		 console.log(response);
		    		 });
		    	 
		     };
		     /*Function for reset button*/
		     $scope.reset = function(){
		    	 $scope.permissionmodel= [];
		    	 $scope.roleName= '';
		    	 $scope.roleDescription= '';
		    	 
		     }
	    
 });
     /*Function for closing modal*/
 	var configRoleController = function ($scope, $uibModalInstance, data) {
 	  $scope.data = data;
 	  $scope.close = function(result){
 		 var uibModalInstance =  $uibModalInstance.close($scope.data);
 	
 	   
 	  }

 	};
