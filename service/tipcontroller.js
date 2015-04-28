var Tip = require('./tip'); // model
var Promise = require('bluebird');

exports.query = function(query, fields, options) {
	return Tip.findAsync(query, fields, options);
};

exports.get = function(id, fields, options) {
	return Tip.findOneAsync({ _id: id }, fields, options);
};

exports.post = function(tip) {
	var newObj = new Tip(tip);

	return newObj.saveAsync();
};

exports.update = function(id, tip, options) {
	return Tip.findOneAndUpdateAsync({ _id: id }, update, options);
};

exports.remove = function(id) {
	return Tip.findOneAndRemoveAsync({ _id: id });
};

exports.page = function(page, limit) {
	return Tip.aggregateAsync([{ $skip: (page - 1) * limit }, { $limit: limit }]);
};

exports.count = function(conditions) {
	return Tip.countAsync(conditions);
}

// attachments
exports.addAttachment = function(att) {

};

exports.removeAttachment = function(id) {
	
};
