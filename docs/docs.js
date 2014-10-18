var fs = require("fs");
var path = require("path");
var async = require("async");
var md = require("markdown");
var rootPath = "/docs/";

/*
{
	directories: {
		directories: {
			files: []
		},
		files: []
	}, files: []

}

function read (root, structure) {
		var files = fs.readdirSync(root);
		files.forEach(function (file) {
			var dir = path.join(root, file);
			var stat = fs.statSync(dir);
			if(stat.isFile()) structure.files.push(file);
			else if(stat.isDirectory()) {
				structure.directories[file] = {
					directories: {},
					files: []
				};

				read(dir, structure.directories[file]);
			}
		})
	}
*/
exports.getStructure = function(root, callback) {
	var structure = {
		directories: [],
		files: []
	};
	var root = path.join(rootPath, root);

	async.waterfall([
			function(cb) {
				fs.readdir(root, cb);
			},
			function(files, cb) {
				async.eachSeries(files, function(file, callback) {
					var dir = path.join(root, file);
					var stat = fs.statSync(dir);
					if(stat.isFile()) {
						structure.files.push(file); callback();
					}
					else if(stat.isDirectory()) {
						structure.directories.push(file); callback();	
					} 
				}, function(err) {
					cb(null, structure);
				});
			}
		], function(err, result) {
			callback(err, result);
		});
}

exports.isFile = function(root) {
	var root = path.join(rootPath, root);
	var stat = fs.statSync(root);
	return stat.isFile();
}

exports.toHtml = function(root, cb) {
	var root = path.join(rootPath, root);
	fs.readFile(root, { encoding: "utf-8" }, function(err, data) {
		if(err) cb(err);
		else {
			cb(null, md.parse(data));
		}
	});
}