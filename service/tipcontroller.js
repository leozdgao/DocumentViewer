var Tip = require('./tip'); // model
var Promise = require('bluebird');
var fs = require('fs');

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
    return Tip.findOneAndUpdateAsync({ _id: id }, tip, options);
};

exports.remove = function(id) {
    return Tip.findOneAndRemoveAsync({ _id: id });
};

exports.page = function(page, limit) {
    return Tip.aggregateAsync([{ $sort: { priority: -1, createDate: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit } ]);
};

exports.tagPage = function (tag, page, limit) {
    return Tip.aggregateAsync([{ $match: { tags: tag  } }, { $sort: { priority: -1, createDate: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit } ]);
};

exports.count = function(conditions) {
    return Tip.countAsync(conditions);
};

exports.getTags = function() {
    var o = {
        map: function() {
            emit(1, { tags: this.tags });
        },
        reduce: function(key, values) {
            var result = { tags: [] };
            values.forEach(function(val) {
                val.tags.forEach(function(i) {
                    if(result.tags.indexOf(i) < 0) result.tags.push(i);
                });
            });
            return result;
        }
    };
    return Tip.mapReduceAsync(o);
};

// attachments
exports.addAttachment = function(id, atts) { // File object
    atts = [].map.call(Object.keys(atts), function(name) {
        var file = atts[name];
        return {
            fileName: file.name,
            contentType: file.type,
            path: file.path
        };
    });
    
    return Tip.findOneAndUpdateAsync({ _id: id }, { $push: { attachments: { $each: atts } } });
};

exports.removeAttachment = function(id, attId) {
    
    return Tip.findOneAsync({ _id: id })
            .then(function (tip) {
                tip.attachments.forEach(function (att) { console.log(att._id);
                    if(att._id == attId) {
                        fs.unlink(att.path, function (e) { console.log(e); });
                    }
                });
                
                return Tip.findOneAndUpdateAsync({ _id: id }, { $pull: { attachments: { _id: attId } } }); 
            });
            
};
