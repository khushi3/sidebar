/*Title: User Management Module
Date: 18/04/2017
Development Team: Emids offshore*/

app.controller('usrGrpListController', function($scope, $http, NgTableParams, $uibModal,$rootScope, $filter) {
	$scope.lastActions = [ 
		  'Created Region',
		  'Edited Region',
		  'Created Concept',
		  'Edited Concept',
		  'Created Branch',
		  'Released Branch'
		  ];
	$rootScope.showSideBar = true;
	$scope.searchedContent = [];
	$scope.tableParams = $scope.searchedContent;
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
					jQuery(".content-wrapper")
							.css(
									'min-height',
									jQuery(window).height()
											- (jQuery('.main-footer')
													.outerHeight() + jQuery(
													'.main-header')
													.outerHeight()));
				});
		$scope.showError = false;
		$scope.isRewsultEnabled = false;
		$scope.displayAllUsers();
	};

   /*function to get user group name*/
	$scope.getUserGroupName = function(obj) {
		localStorage.setItem("dispalyUserGroupName",
		obj.target.attributes.data.value);

	}
	/*function to display user group name*/
	$scope.displayAllUsers = function() {
		console.log("displayAllUsers");
		$scope.isResultEnabled = false;

		$http({
			url : "data/usrgrp.json",
			method : "GET"

		}).then(function(response) {
			console.log(response);
			$scope.searchedContent = createUIDataModel(response.data);
			$scope.tableParams = getNgtableParam($scope.searchedContent);
			$scope.tableParams.reload();
			$scope.tableParams.page(1);
			$scope.tableParams.sorting({});

		}, function(response) {
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
			count : 10,
			sorting : {
				name : "desc"
			}
		}, {
			dataset : data
		});
		return ngtable;
	}
	;

	function createUIDataModel(data) {
		var results = [];
		var usrgrps = data.usergrp;
		for (var i = 0; i < usrgrps.length; i++) {
			var usrgrp = usrgrps[i];
			var resusrgrp = {};
			resusrgrp.data = usrgrp;
			resusrgrp.userGroupName = usrgrp.userGroupName;
			resusrgrp.roleNames = getRoleNamesAsCSV(usrgrp.roles);
			resusrgrp.usersCount = usrgrp.users.length;
			resusrgrp.dateCreated = usrgrp.dateCreated; 
			resusrgrp.lastActive = getLastActive(usrgrp);
			resusrgrp.id = usrgrp.id;
			//console.log(resusrgrp.lastActive);
			results.push(resusrgrp);
			 
		}
		return results;
	}
	;
	/*function to get roles name*/
	function getRoleNamesAsCSV(roles) {
		var roleNames = '';
		for (var j = 0; j < roles.length; j++) {
			roleNames += roles[j].roleName + ', ';
		}

		if (roleNames.endsWith(', ')) {
			roleNames = roleNames.substring(0, roleNames.length - 2);
		}

		return roleNames;
	}
	
	function getLastActive(usergrp) {

	    var lastActive;
	    // get random user + random actions , only if group contains users
	    if((usergrp.users != undefined || null) && (usergrp.users.length != 0)){
	      console.log('inside ');
	      lastActive = usergrp.users[Math.floor((Math.random() * usergrp.users.length))].userName + ' : ' +
	      $scope.lastActions[Math.floor((Math.random() * $scope.lastActions.length))];
	    }
	    return lastActive;
	  }

		$scope.cancel = function(row, rowForm) {
		row.isEditing = false;
		var originalRow = resetRow(row, rowForm);
		angular.extend(row, originalRow);
		$scope.myVar = true;
		$scope.myVarSel = false;

	};
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

	$scope.edit = function(selectedActionRow) {

		if ($scope.selectedActionRow != null) {
			$scope.myVar = false;
			$scope.myVarSel = true;
			$scope.isEditing = true;
			var varient = $scope.searchedContentEdit[$scope.selectedActionRow];
		}

	};
	$scope.setRowSelection = function(id) {
		$scope.selectedActionRow = id;
	};
	$scope.search();
	
	/*function to open modal popup on create user group*/
	 $scope.open = function() {
		console.log('opening pop up');
		var uibModalInstance = $uibModal.open({
			 templateUrl: 'uiModule/userManagement/usergroups/modal.html',
			controller: function($scope,$uibModalInstance) {
				$scope.close = function () {
					console.log('closing pop up');
					$uibModalInstance.dismiss('cancel');
				};
				$scope.create=function(){
	            	   alert("users list");
	               };
               $scope.addUsers=function(){
            	  /* alert("users list");*/
            	   
            	   /*function to open modal popup on add users*/
            	   $uibModal.open({
            		   templateUrl:'uiModule/userManagement/usergroups/users_list.html',
            		   controller: usrGrpListController
            	   });  
            	   }
			}
			
		});
	
	};
	
	/*function to display multi select window*/
	 function usrGrpListController($scope, $http, NgTableParams, $uibModal,$rootScope, $filter,$uibModalInstance) {
		 $scope.close = function () {
				console.log('closing pop up');
				$uibModalInstance.dismiss('cancel');
			};
	        activate();
	        function activate() {
	        	$scope.leftValue = [];
	            var leftcounter = 0;
	            $scope.rightValue = [];
	            var rightcounter = 0;
	            $scope.addValue = [];
	            $scope.removeValue = [];
	            

	            function loadMoreLeft() {
	           
	            	$http({
	        			url : "http://localhost:7000/users",
	        			method : "GET"

	        		}).then(function (response){
	        			console.log(response);
	        			$scope.leftValue = response.data;
	        		})
	            	


	            }

	            function loadMoreRight() {
	               /*
	                	$scope.rightValue.push({
	                        'firstName': right
	                    });
	                   */
	                


	            }


	            $scope.options = {
	                leftContainerScrollEnd: function () {
	                	console.log("inside data");
	                    loadMoreLeft();


	                },
	                rightContainerScrollEnd: function () {
	                    loadMoreRight();

	                },
	                leftContainerSearch: function (text) {
	                    console.log(text)
	                    $scope.leftValue = $filter('filter')(leftValue, {
	                        'firstName': text
	                    })

	                },
	                rightContainerSearch: function (text) {

	                	$scope.rightValue = $filter('filter')(rightValue, {
	                        'firstName': text
	                    })
	                },
	                leftContainerLabel: 'Available Users',
	                rightContainerLabel: 'Selected Users',
	                onMoveRight: function () {
	                    console.log('right');
	                    console.log($scope.addValue);

	                },
	                onMoveLeft: function () {
	                    console.log('left');
	                    console.log($scope.removeValue);
	                }

	            };
	            console.log($scope.options)
	            loadMoreLeft();
	            loadMoreRight();


	            var leftValue = angular.copy($scope.leftValue)

	            var rightValue = angular.copy($scope.rightValue)

	        }
	        $scope.save = function (){
	            $uibModalInstance.close($scope.rightValue);
	};
	 }
	
});
