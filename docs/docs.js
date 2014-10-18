var fs = require("fs");
var path = require("path");
var async = require("async");
var md = require("markdown");

module.exports = function(rootPath) {
	var availableExt = [
		".markdown",
		".mdown",
		".mkdn",
		".md",
		".mkd",
		".mdwn",
		".mdtxt",
		".mdtext",
		".text",
		".txt"
	];

	return {
		getStructure: function(root, callback) {
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
								if(availableExt.indexOf(path.extname(file)) > -1) 
									structure.files.push(file);

								callback();
							}
							else if(stat.isDirectory()) {
								structure.directories.push(file);

								callback();	
							}
							else callback();
						}, function(err) {
							cb(null, structure);
						});
					}
				], function(err, result) {
					callback(err, result);
				});
		},
		isFile: function(root) {
			var root = path.join(rootPath, root);
			var stat = fs.statSync(root);
			return stat.isFile();
		},
		toHtml: function(root, cb) {
			var root = path.join(rootPath, root);
			fs.readFile(root, { encoding: "utf-8" }, function(err, data) {
				if(err) cb(err);
				else cb(null, md.parse(data));
			});
		}
	}
}