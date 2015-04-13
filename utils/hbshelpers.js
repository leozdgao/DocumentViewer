// handlebar helpers
module.exports = {
	filename: function(context, options) {
	    
	    var index = context.lastIndexOf('\\');
	    return context.slice(index + 1);
	}
}