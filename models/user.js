const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    isAdmin: Boolean,
})

userSchema.virtual("fullName").get(function() {
    return `${firstName} ${lastName}`;
});

module.exports = mongoose.model("User", userSchema);