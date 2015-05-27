var express = require('express');
var qs = require('querystring');
var bodyParser = require('body-parser');
var qnService = require('../service/qn_service');
var router = express.Router();

/**
 * Url for token request
 */
router.get('/token', function (req, res) {
	
	// opts for upload token
	
	res.status(200).json({
		token: qnService.getUploadToken()
	});
});

/**
 * Callback url for qiniu upload callback mode, and response in json format which 
 * will be responsed to client by qiniu service.
 * 
 * DevDoc: http://developer.qiniu.com/docs/v6/api/overview/up/response/callback.html
 * 
 * Example request body:
 * 
 *     POST /callback  HTTP/1.1
 *     Content-Type: application/x-www-form-urlencoded
 *	   User-Agent: qiniu go-sdk v6.0.0
 *	   Host: api.examples.com
 *	   Authorization: QBox iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV:tDK-3f5xF3SJYEAwsll5g=
 *		
 *	   name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm- \
 *	   RlQx_4O2&location=Shanghai&price=1500.00&uid=123
 */
router.post('/callback', bodyParser.urlencoded({extended: true}), function (req, res) {
	
	// check Authorization header
	if(qnService.checkAuth(req.get('Authorization'), req.path, qs.stringify(req.body))) {
		
		// parse body
		var fsize = req.body.fsize;
		var fname = req.body.fname;
		var key = req.body.key;
				
		// save meta data to db
		
		// response
		res.json({
			success: true
		});
	}
	// invalid callback request
	else {
		res.status(401).end();
	}
});