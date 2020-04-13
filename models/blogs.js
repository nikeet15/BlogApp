
var mongoose = require("mongoose");

//MONGOOSE MODEL SCHEMA.............
var blogSchema = mongoose.Schema({
    username: String,
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("_blog", blogSchema);       // blog DB object
module.exports= Blog;