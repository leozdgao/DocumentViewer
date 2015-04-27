var moment = require('moment');

// handlebar helpers
module.exports = {
    filename: function(context, options) {
        
        var index = context.lastIndexOf('\\');
        return context.slice(index + 1);
    },
    navItem: function(context, type, options) {

        return '<li' + (context == type ? ' class="active"': '') + '>' + options.fn(this) + '</li>';
    },
    date: function(date, format, options) {

        return moment(date).format(format);
    }
}
