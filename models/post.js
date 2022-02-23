const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  tags: [String],
  isPublished: Boolean,
  timestamp: Date,
  lastUpdate: Date,
});

module.exports = mongoose.model("Post", postSchema);
