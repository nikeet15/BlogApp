
var mongoose= require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var loginSchema = mongoose.Schema({
    username: String,
    password: String
});

loginSchema.plugin(passportLocalMongoose);           // for using pasport methods....

var Login = mongoose.model("_login", loginSchema);    // login DB object
module.exports= Login;