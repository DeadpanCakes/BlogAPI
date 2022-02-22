const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  parent: { required: false, type: Schema.Types.ObjectId, ref: "Comment" },
  timestamp: Date,
  content: String,
});

module.exports = mongoose.model("Comment", commentSchema);
