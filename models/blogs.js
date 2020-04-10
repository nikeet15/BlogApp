
var mongoose = require("mongoose");

//MONGOOSE MODEL SCHEMA.............
var blogSchema = mongoose.Schema({
    userID: String,
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("blog", blogSchema);       // blog DB object
module.exports= Blog;