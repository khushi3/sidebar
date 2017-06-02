

app.controller('loginController',function ($scope, $rootScope, $location, $cookieStore, $http) {
    // reset login status -- remove existing user
    $cookieStore.remove('loggedInUser');
    $scope.error = false;
    $rootScope.showSideBar = false;
    $scope.login = function () {
        $scope.dataLoading = true;
        //TODO Service call to do LDAP Authentication
        var isAuthenticUser = true; // change value based on service call response

        if(isAuthenticUser){
            var loggedInUser = {
                    userName : $scope.username
            }
            $cookieStore.put('loggedInUser', loggedInUser);

            //TODO Need to discuss with Business for actual routing
            $rootScope.showSideBar = true;
            $location.path('/regbranch');
            
            
        }else {
            $scope.error = 'Invalid Username and/or Password !!!';
            $scope.dataLoading = false;
        }
    };
});

app.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        loggedInUser = $cookieStore.get('loggedInUser');         
        $rootScope.showSideBar = true;
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !loggedInUser){
            $location.path('/login');
            $rootScope.showSideBar = false;
            
        }
    });
}]);


