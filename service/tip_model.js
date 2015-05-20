var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var tipSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, auto: true },
	title: { type: String },
	content: { type: String },
	tags: { type: [String] },
	priority: { type: Number, default: 0 },
	createDate: { type: Date, default: new Date() },
	attachments: {
		type: [{
			fileName: { type: String },
			contentType: { type: String },
			path: { type: String }
		}]
	}
});

module.exports = mongoose.model('Tip', tipSchema);
