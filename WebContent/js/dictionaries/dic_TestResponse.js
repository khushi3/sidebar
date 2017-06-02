app.controller('testResponseController', function($scope, $http, ngTableParams) {
     $scope.goBack = function(){
          window.history.back();
            console.log("test");
        };
        $scope.filterText = function(){
            var searchText = $("#filterText").val();
           
            var myHilitor = new Hilitor("responsedata"); myHilitor.apply(searchText);
            //$("#responsedata").mark(searchText);
        };
        
        $scope.search = function () {
           jQuery(document).ready(function() {
    	   	   jQuery(".content-wrapper").css('min-height', jQuery( window ).height() - ( jQuery('.main-footer').outerHeight()+ jQuery('.main-header').outerHeight()));
           });
        };
      
        $scope.init = function() {
          $scope.search();
        }
              
        $scope.init();

 });
