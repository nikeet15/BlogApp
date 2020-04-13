
var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var loginSchema = mongoose.Schema({
    userID: String,
    password: String
});

loginSchema.plugin(passportLocalMongoose);           // for authentication

var Login = mongoose.model("login", loginSchema);    // login DB object
module.exports= Login;