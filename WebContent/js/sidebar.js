

app.directive('extLink', function() {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      console.log(elem);
      elem.bind('click', function(e) {
          console.log("sidebar");
        console.log(e);
        e.preventDefault();
        $("#wrapper").toggleClass("active")
      });
    }
  };
})

app.controller('sidebarController', function($scope,$cookies) {
    
    
    $scope.userRole = ($cookies.getObject("loggedInUserRole")).userRole;
    /*if($scope.userRole != "" && $scope.userRole != undefined){
        if($scope.userRole == GUESTROLE){
            $scope.adminLink = false
        }
    
        else if($scope.userRole == ADMINROLE){
            $scope.adminLink = true
        }
        else if($scope.userRole == SMEROLE){
            $scope.adminLink = true
        }
        else if($scope.userRole == PROMOTERROLE){
            $scope.adminLink = true
        }
    }*/
        
    
});