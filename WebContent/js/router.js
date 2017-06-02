var hostUrl = location.protocol + "//" + window.location.host;
var app = angular.module('regionsWebApp', [
  'ngTable','ngRoute','Authentication','ngCookies','googlechart','ui.bootstrap','ng-duallist','angularjs-dropdown-multiselect'
]);

/*
var app = angular.module('regionsWebApp', [
	  'ngTable','ngRoute', 'googlechart'
	]);*/


/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/login", {templateUrl: "uiModule/login.html", controller: "loginController"})
    .when("/", {templateUrl: "uiModule/regions/reg_Branch.html", controller: "branchListController"})
    // Regions
    .when("/regbranch", {templateUrl: "uiModule/regions/reg_Branch.html", controller: "branchListController"})
    .when("/regsearch/:branchId", {templateUrl: "uiModule/regions/reg_Search.html", controller: "regionSearchController"})
    .when("/regworkspace/:branchId", {templateUrl: "uiModule/regions/reg_Workspace.html", controller: "workspaceController"})
    .when("/regteststatus/:testId", {templateUrl: "uiModule/regions/reg_test_status.html", controller: "testStatusController"})
    .when("/regboilersearch/:branchId", {templateUrl: "uiModule/regions/reg_BoilerSearch.html", controller: "boilerSearchController"})
    .when("/regmapping/:branchId", {templateUrl: "uiModule/regions/reg_Mapping.html", controller: "mappingController"})  
    //dictionaries
    .when("/dicbranch", {templateUrl: "uiModule/dictionaries/dic_Branch.html", controller: "branchListControllerDictionary"})
    .when("/dicsearch/:branchId", {templateUrl: "uiModule/dictionaries/dic_SearchContent.html", controller: "varientGroupController"})
    .when("/dicworkspace/:branchId", {templateUrl: "uiModule/dictionaries/dic_Workspace.html", controller: "workspaceContrl"})
    .when("/dicrelease", {templateUrl: "uiModule/dictionaries/dic_ReleasePage.html", controller: "releasePageController"})
    .when("/dicresponse", {templateUrl: "uiModule/dictionaries/dic_TestResponse.html", controller: "testResponseController"})
    .when("/dicteststatus/:testId", {templateUrl: "uiModule/regions/dic_test_status.html", controller: "dicTestStatusController"})
    .when("/commonworkspace", {templateUrl: "uiModule/common/common_workspace.html", controller: "commonWorkspaceController"})
    .when("/commonrelease", {templateUrl: "uiModule/common/common_release.html", controller: "commonReleaseController"})
   
   /* user-management*/
    .when("/usrgrp_List", {templateUrl: "uiModule/userManagement/usergroups/usrgrp_List.html", controller: "usrGrpListController"})
    .when("/config_role", {templateUrl: "uiModule/userManagement/configurationModule/config_role.html", controller: "configRoleController"})
    .when("/config_action", {templateUrl: "uiModule/userManagement/configurationModule/config_action.html", controller: "configActionController"})
    .when("/create_permission", {templateUrl: "uiModule/userManagement/configurationModule/config_createPermission.html", controller: "createPermissionController"})
    // else 404
    .otherwise({ redirectTo: '/login' });
}]);
