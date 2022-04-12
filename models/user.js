const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  isAdmin: Boolean,
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("url").get(function () {
  return `/api/users/${this._id}`;
});

userSchema.virtual("fetchUrl").get(function () {
  return `/users/${this._id}`;
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
