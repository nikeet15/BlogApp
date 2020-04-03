//Ctrl+j to toggle terminal

//app config............
var express = require("express");
var app = express();                                 // express() return an object 

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));                  //making public a static directory
app.set("view engine", "ejs");                      //if written no need to write .ejs only write name of file

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/EmployeeDB', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (!err)
        console.log("connection successfull");

    else
        console.log("error in DB cnnection" + err);
});

//model schema.............
var blogSchema= mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog= mongoose.model("blog", blogSchema);


//routes..............
app.get("/", function (req, res) {
    res.redirect("blogs");
});

app.get("/blogs", function(req, res){

    Blog.find({}, function(err, blogs)
    {
        if(!err){
            console.log("1. retrieve data successfull");
            res.render("index", {blogs: blogs});
        }
        else
            console.log("1. not able to retrieve from database");
    });
});

app.get("/blogs/new", function (req, res) {
    res.render("new");
});






 
//starting server code..............................
app.listen(3000, function () {
    console.log("server started");
});
