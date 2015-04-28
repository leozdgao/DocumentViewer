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
    },
    repeater: function(count, options) {

        var html = '';
        for(var i = 0; i < count; i++) {
            html += options.fn(i + 1);
        }
        return html;
    },
    ifEqual: function(a, b, options) {
        if(a == b) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        } 
    },
    add: function(a, b, options) {
        return (a + b) || '';
    }
}
