var hostUrl = location.protocol + "//" + window.location.host;
var regionUrl = hostUrl + '/api-rc-nlp/regions';
var variantUrl = hostUrl + '/api-rc-nlp/variants';
var branchUrl = hostUrl + '/api-rc-nlp/branches';

var regionWorkspaceIds = [];
var testStatus;
var testData;
var regTestData;
var dicTestData;
var boilerTestData;
var testId;
var testComments="";

this.setRegionWorkspaceIds = function(editedIds) {
	regionWorkspaceIds = editedIds;
}

this.getRegionWorkspaceIds = function() {
	return regionWorkspaceIds;
}

this.setBoilerTestData= function(testRequest){
	boilerTestData = testRequest
}

this.getBoilerTestData = function() {
	return boilerTestData;
}

this.setTestStatus = function(testSta) {
	testStatus = testSta;
}

this.getTestData = function() {
	return regTestData;
}

this.setTestData = function(testDa) {
	regTestData = testDa;
}

this.getDictTestData = function() {
	return dicTestData;
}

this.setDictTestData = function(testDa) {
	dicTestData = testDa;
}

this.getTestComments = function() {
	return testComments;
}

this.setTestComments = function(testComm) {
	testComments = testComm;
}

this.getTestId = function() {
	return testId;
}

//Urls for Crud Operation On User Management module
var getAllPermissionsUrl = hostUrl + "/api-rc-nlp/usermgmt/config/permission";
var newPermissionUrl = hostUrl + "/api-rc-nlp/usermgmt/config/permission";
var getAllPermissionsUrlExists = hostUrl + "/api-rc-nlp/usermgmt/config/permission/"; 

var deleteRoleUrl = hostUrl + '/api-rc-nlp/usermgmt/config/role/';
var updateRoleUrl = hostUrl + '/api-rc-nlp/usermgmt/config/role/';
var newRoleUrl = hostUrl + '/api-rc-nlp/usermgmt/config/role/';

var getAllUserGrpsUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp';
var newUserGrpUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp';
var updateUserGrpUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp/';
var deleteUserGroupUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp/';
var deleteMultiUserGrpUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp';

var getAllUsersUrl = hostUrl + '/api-rc-nlp/usermgmt/usergrp/users';
var getAllRolesUrl = hostUrl + '/api-rc-nlp/usermgmt/config/role';
var getAllRolesUrlExits = hostUrl + '/api-rc-nlp/usermgmt/config/role/';

var GUESTROLE = 'GUEST ROLE';
var ADMINROLE = 'ADMIN ROLE';
var SMEROLE = 'ADMIN ROLE';
var PROMOTERROLE = 'ADMIN ROLE';

this.setTestId = function(testid) {
	testId = testid;
}
