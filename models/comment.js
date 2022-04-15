const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  parent: { required: false, type: Schema.Types.ObjectId, ref: "Comment" },
  timestamp: Date,
  content: String,
  commentOf: { type: Schema.Types.ObjectId, ref: "Post" },
});

commentSchema.virtual("url").get(function () {
  return `/api/posts/${this.commentOf._id}/comments/${this._id}`;
});

commentSchema.virtual("fetchUrl").get(function () {
  return `/posts/${this.commentOf._id}/comments/${this._id}`;
});

commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", commentSchema);
