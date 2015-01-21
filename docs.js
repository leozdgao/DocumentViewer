var fs = require("fs"),
    path = require("path"),
	Then = require("thenjs");

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

			root = path.join(rootPath, root);

			Then(function (cont) {
				fs.readdir(root, cont);
			})
			.then(function (cont, files) {
				cont(null, files);
			})
			.each(null, function (cont, file) {
				//ignore file start with _
				if(!/^_/.test(file)) {
	                var	dir = path.join(root, file)
					stat = fs.statSync(dir);

	                if(stat.isFile() && availableExt.indexOf(path.extname(file)) > -1) {
                        structure.files.push(file);
	                }
	                else if(stat.isDirectory()) {
	                    structure.directories.push(file);
	                }
				}

				cont();
			})
			.then(function (cont) {
				// process readme.md
				var readme;
				var temps = structure.files.filter(function(file) {
					return file.toLowerCase().indexOf("readme") > -1;
				}) || [];
				if(temps.length > 0) {

					var file = temps[0];
					var content = fs.readFileSync(path.join(root, file)).toString();
					readme = md.render(content);
				}

				callback(null, structure, readme);
			}) 
			.fail(function (cont, err) {
				if(typeof err == "string") {
					err = { message : err, status : 500 }
				}
				callback(err);
			});
		},
		//judge the specific path is a file or not
		isFile: function(root) {
			var root = path.join(rootPath, root);
            if(fs.existsSync(root)) {
                var stat = fs.statSync(root);
			    return stat.isFile();
            }
			else return false;
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
