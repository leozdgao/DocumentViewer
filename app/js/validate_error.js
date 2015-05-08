var ValidateError = function (field, message) {
	this.field = field;
	this.message = message;
}

ValidateError.prototype = Error.prototype;

module.exports = ValidateError;