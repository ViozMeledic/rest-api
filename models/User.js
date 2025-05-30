const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    createdDate: Date,
    lastModified: Date,
})

const User = mongoose.model('User', userSchema)
module.exports = User