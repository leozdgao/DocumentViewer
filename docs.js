var fs = require("fs"),
    path = require("path"),
	q = require("q");

//init Remarkable
var remarkable = require("remarkable");
    md = new remarkable({
        html:         true,         // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkify:      true,         // autoconvert URL-like texts to links
        typographer:  true          // Enable smartypants and other sweet transforms
    });
    

module.exports = function(rootPath) {
    //available extension for platform
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
		//get directory structure of specific folder
		getStructure: function(root, callback) {
			var structure = {
				directories: [],
				files: []
			};
			var root = path.join(rootPath, root),
				_readdir = q.nfbind(fs.readdir);

			_readdir(root).then(function(files){
				var promises = files.map(function(file){
					return (function(file){
						var defer = q.defer(),
							dir = path.join(root, file),
							stat = fs.statSync(dir);

						if(stat.isFile()) {
							if(availableExt.indexOf(path.extname(file)) > -1) {
								structure.files.push(file);
							}
							defer.resolve();
						}
						else if(stat.isDirectory()) {
							structure.directories.push(file);
							defer.resolve();
						}
						else defer.reject();

						return defer.promise;
					})(file);
				});

				return q.all(promises);
			}).then(function(){
				callback(null, structure);
			}).catch(function(err){
				if(typeof err == "string") {
					err = { message : err, status : 500 }
				}
				callback(err);
			});
		},
		//judge the specific path is a file or not
		isFile: function(root) {
			var root = path.join(rootPath, root);
			var stat = fs.statSync(root);
			return stat.isFile();
		},
		//parse the md file to html
		toHtml: function(root, cb) {
			var root = path.join(rootPath, root), result = "",
                readable = fs.createReadStream(root, { encoding: "utf-8" });
            
            readable.on("data", function(chunk){
                result += chunk;
            });
            readable.on("end", function(){
                cb(null, md.render(result));
            });
            readable.on("error", function(err){
                cb(err);
            });
		}
	}
}
