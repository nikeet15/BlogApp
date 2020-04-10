
var mongoose= require("mongoose");

var loginSchema = mongoose.Schema({
    userID: String,
    password: String
});

var Login = mongoose.model("login", loginSchema);    // login DB object
module.exports= Login;