var hostUrl = location.protocol + "//" + window.location.host;
var regionUrl = hostUrl + '/api-rc-nlp/regions';
var variantUrl = hostUrl + '/api-rc-nlp/variants';
var branchUrl = hostUrl + '/api-rc-nlp/branches';

var regionWorkspaceIds = [];
var testStatus;
var testData;

this.setRegionWorkspaceIds = function(editedIds) {
	regionWorkspaceIds = editedIds;
}

this.getRegionWorkspaceIds = function() {
	return regionWorkspaceIds;
}

this.setTestStatus = function(testSta) {
	testStatus = testSta;
}

this.getTestData = function() {
	return testData;
}

this.setTestData = function(testDa) {
	testData = testDa;
}

this.getDictTestData = function() {
	return testData;
}

this.setDictTestData = function(testDa) {
	testData = testDa;
}
