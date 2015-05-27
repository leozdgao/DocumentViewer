var qn = require('qiniu');
var qs = require('querystring');
var crypto = require('crypto');
var config = require('../config.json');

exports.checkAuth = function (authHeader, path, body) {
	if(/^QBox /.test(authHeader)) {
		var temp = authHeader.slice(5).split(':');
		var access_key = temp[0];
		
		if(config.qiniu['access_key'] == access_key) {
			var encoded_data = temp[1];
		 	var secret_key = config.qiniu['secret_key'];
			 
			var data = path + '\n' + body;
			var key = crypto.createHmac('sha1', secret_key).update(data).digest('base64');
			
			if(encoded_data == key) return true;
		}
	}
	
	return false;
};

/**
 * Generate PutPolicy for qiniu
 * 
 * DevDoc: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html
 */
exports.getUploadToken = function () {
	var putPolicy = new qn.rs.PutPolicy('testbucket');
	putPolicy.callbackUrl = '/qnservice/callback';
	putPolicy.callbackBody = qs.stringify({
		key: '$(key)',
		fname: '$(fname)',
		fsize: '$(fsize)'
	});
	
	return putPolicy.token();
};