const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    isAdmin: Boolean,
})

userSchema.virtual("fullName").get(function() {
    return `${firstName} ${lastName}`;
});

userSchema.virtual("url").get(function() {
    return `/api/users/${this._id}`
})

module.exports = mongoose.model("User", userSchema);