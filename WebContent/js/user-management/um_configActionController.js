
app.controller('configActionController',function($scope, $rootScope, $http, NgTableParams, $uibModal,$rootScope, $filter, $location,$log, $uibModal) {
	$scope.errorMsg = "";
	 $rootScope.showSideBar = true;
		$scope.searchedContent = [];
		$scope.permissionobj = [];
		$scope.tableParams = $scope.searchedContent;
		$scope.search = function() {
			jQuery(document).ready(function() {
				jQuery(".content-wrapper").css('min-height',jQuery(window).height()- (jQuery('.main-footer').outerHeight() + jQuery('.main-header').outerHeight()));
			});
			$scope.displayAllRoles();
		};
		   
		    
			$scope.createRole = function(){
		    	$location.path("config_role");
		    };
		    $scope.createPermission = function(){
		    	$location.path("create_permission");
		    };
		    
		    $scope.displayAllRoles = function() {
				$scope.isResultEnabled = false;

				$http({
					url : getAllRolesUrl,
					method : "GET"
				})
				.then(function(response) {
					$scope.searchedContent = createUIDataModel(response.data);
					$scope.tableParams = getNgtableParam($scope.searchedContent);
					$scope.tableParams.reload();
					$scope.tableParams.page(1);
					$scope.tableParams.sorting({});
				},
				function(response) {
					$scope.tableParams = getNgtableParam($scope.searchedContent);
					reloadTableContent($scope.tableParams);
				});

			}

			function reloadTableContent(table) {
				table.reload();
				table.page(1);
				table.sorting({});
			}

			function getNgtableParam(data) {
				$scope.data = data;
				var ngtable = new NgTableParams({
					page : 1,
					count : 5,
					sorting : {
						name : "desc"
					}
				}, {
					dataset : data
				});
				return ngtable;
			}
			
			function createUIDataModel(data) {
				var results = [];
				var roles = data;
				console.log(data.roles);
				for (var i = 0; i < roles.roles.length; i++) {
					var role = roles.roles[i];
					var resrole = {};
					resrole.roleName = role.roleName;
					if(role.permissions != null || role.permissions != undefined){
						resrole.permissionNames = getPermissionseNamesAsCSV(role.permissions);
					}else{
						resrole.permissionNames="";
					}
					resrole.roleDesc = role.roleDesc;
					resrole.dateCreated = role.createdOn.substring(0,19);
					resrole.permission = role.permissions;
					resrole.id = role.roleId;
					results.push(resrole);
				}
				results.sort((a, b) => b.id - a.id);
				return results;
			}
			

			function getPermissionseNamesAsCSV(permissions) {
				var permissionNames = '';
				for (var j = 0; j < permissions.length; j++) {
					permissionNames += permissions[j].permissionName + ', ';
				}

				if (permissionNames.endsWith(', ')) {
					permissionNames = permissionNames.substring(0,
							permissionNames.length - 2);
				}

				return permissionNames;
			}

			function getLastActive(usergrp) {

				var lastActive;
				// get random user + random actions , only if group
				// contains users
				if ((usergrp.users != undefined || null)
						&& (usergrp.users.length != 0)) {
					console.log('inside ');
					lastActive = usergrp.users[Math.floor((Math
							.random() * usergrp.users.length))].userName
							+ ' : '
							+ $scope.lastActions[Math
								.floor((Math.random() * $scope.lastActions.length))];
				}
				return lastActive;

			}

			$scope.search();
			
		  $scope.delete = function(role,index){ 
		     var ID = role.id
		     if (confirm("Are you sure you want to delete this Role?")) {
		    	$http({
		    	 url : deleteRoleUrl + ID + '/' + modifiedBy,
		    	 method : "DELETE"   
		    	}).then(function(response) {
		    		/*console.log(response.data.errorMsg)*/
		    		//$scope.errorMsg = response.data.errorMsg;
		    		if(response.data.errorMsg != undefined){
		    			alert(response.data.errorMsg );
		    		}
		    		
		    		$scope.displayAllRoles();
		    		$scope.tableParams.reload();
		    		$scope.tableParams.page(1);
		    		$scope.tableParams.sorting({});
		    		}, function(response) {
		    			$scope.tableParams = getNgtableParam($scope.searchedContent);
		    			reloadTableContent($scope.tableParams);
		    	});
		    }else{
		    	   return false;
		    }
		   }
		    
		    
		    $scope.onview = function(role,$index){
		    	console.log(role);
				 var uibModalInstance = $uibModal.open({
					 templateUrl: 'uiModule/userManagement/configurationModule/config_actionview.html',
					 backdrop:'static',
					 keyboard:false,
					 resolve: {
						 roleObj : function() {
							 return role;
						 }
					 },
					 controller: function($scope,$uibModalInstance,roleObj) {
						 $scope.roleObj=roleObj;
						 $scope.close = function () {	
							 $uibModalInstance.dismiss('cancel');
						 };
			         }
				 });
			 };
			 
			 $scope.role_edit = function(role,$index){
				 var ID = role.id;
				 var modalInstance =  $uibModal.open({
		             templateUrl:'uiModule/userManagement/configurationModule/config_editrole_modal.html',
		             backdrop:'static',
		    		 keyboard:false,
		             controller: editConfigRolePermissionsController,
		             resolve: {
		            	 role: function () {
		                     return role;
		                 }
		             }
		         });
			}
			 
			 function editConfigRolePermissionsController($scope, $http, NgTableParams,$uibModalInstance, $uibModal, $rootScope, $filter, role) {
				 var ID = role.id;
				 $scope.roleName = role.roleName; 
				 $scope.close = function () {
					 $uibModalInstance.dismiss('cancel');
				 };
				 activate();
				 function activate() {
					 $scope.leftValue = [];
				     $scope.rightValue = [];
				     $scope.addValue = [];
				     $scope.removeValue = []; 
				     $scope.allpermissions =[];
				     $scope.exitspermissions = [];
				     function loadMoreLeft() {
				        $http({
				        	url : getAllPermissionsUrl,
				         method : "GET"
				        }).then(function (response){
				        	console.log(response.data)
				        	$scope.allpermissions = response.data.permissions;
				                $scope.exitspermissions = role.permission;
				                if($scope.exitspermissions != null || $scope.exitspermissions != undefined ){
				                	for(var i = 0; i < $scope.exitspermissions.length; i++){
				                		var id = $scope.exitspermissions[i].permissionId;
				                		for(var j = 0; j < $scope.allpermissions.length; j++){
				                			if(id == $scope.allpermissions[j].permissionId){
				                				console.log($scope.allpermissions[j].permissionId)
				                				var index = $scope.allpermissions.indexOf($scope.allpermissions[j]);
				                				$scope.allpermissions.splice(index,1);
				                			}
				                		}
				                	}
				                }
				            $scope.leftValue =  $scope.allpermissions;
				       })
				     }
				           
				     function loadMoreRight() {
				    	 if(role.permission != null){
					    	   $scope.rightValue = role.permission;
					         }else{
					        	 $scope.rightValue = [];
					         }
				     }
				           
				     $scope.options = {
				        leftContainerScrollEnd: function () {},
				        rightContainerScrollEnd: function () {},
				        leftContainerSearch: function (text) {},
				        rightContainerSearch: function (text) {},
				        leftContainerLabel: 'Available Permissions',
				        rightContainerLabel: 'Selected Permissions',
				        onMoveRight: function (){},
				        onMoveLeft: function () {}
				     };
				     loadMoreLeft();
				     loadMoreRight();
				     var leftValue = angular.copy($scope.leftValue)
				     var rightValue = angular.copy($scope.rightValue)
		
				     $scope.save = function(){
				    	 var req = {
						 roleName: role.roleName,
						 roleDesc: role.roleDesc,
						 permissions: $scope.rightValue,
						 createdBy : createdBy,
						 modifiedBy: modifiedBy,
						 createdOn : role.dateCreated
						 };
						 $http({
						       url : updateRoleUrl +ID,
						       method: "PUT",
						       data: angular.toJson(req), 
						 headers : {
						 'Content-Type' : 'application/json'
						 }
						   }).then(function(response) {
						  
						 $scope.tableParams = getNgtableParam($scope.searchedContent);
						  reloadTableContent($scope.tableParams);
						  window.location.reload();
						 });
				    }           
				 }  
			 }			 
		});
 	