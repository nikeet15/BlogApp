//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");
var app = express();                                 // express() return an object 

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));                  //making public a static directory
app.set("view engine", "ejs");                      //if written no need to write .ejs only write name of file

var methodOverride= require("method-override");
app.use(methodOverride("_method"));                 //ENABLES METHOD OVERRIDING

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/EmployeeDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {
    if (!err)
        console.log("Database connection successfull");

    else
        console.log("error in DB cnnection" + err);
});

//MONGOOSE MODEL SCHEMA.............
var blogSchema= mongoose.Schema({
    userID: String,
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var loginSchema = mongoose.Schema({
    userID: String,
    password: String
});

var Blog= mongoose.model("blog", blogSchema);       // blog DB object
var Login= mongoose.model("login", loginSchema);    // login DB object

//ROUTES..............
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {                         // INDEX PAGE
    res.render("login");
});

app.post("/blogs", function(req, res){

    Login.findOne({ userID: req.body.login.userID, password: req.body.login.password}, function(err, foundUser){
        if(!err){
            if(foundUser)
            {
                console.log("1. user found successfully");
                console.log(foundUser);
                res.redirect("/blogs/" + req.body.login.userID);
            }

            else{
                console.log("1. wrong userID/password");
                res.redirect("/blogs");
            }
        }
        else{
            console.log("1. error in connecting to DB");
            res.redirect("/");
        }
    });
});

app.get("/blogs/signup", function(req, res){
    res.render("signup");
});

app.post("/blogs/signup", function(req, res){
    Login.create(req.body.login, function(err, newUser){
        if (!err) {
            console.log("2. new user added to database");
            console.log(newUser);
            alert("User registered");
            res.redirect("/blogs/" + req.body.login.userID);
        }

        else {
            console.log("2. error in adding new user");
            res.redirect("/blogs/signup");
        }
    });
});

app.get("/blogs/:user", function(req, res){

    Blog.find({}, function(err, blogs)
    {
        if(!err){
            console.log("1. retrieve data successfull");
            res.render("index", {blogs: blogs, user: req.params.user});
        }
        else
            console.log("1. not able to retrieve from database");
    });
});

app.get("/blogs/:user/new", function(req, res) {                  // NEW POST ADDING PAGE
    res.render("new", {user: req.params.user});
});

app.post("/blogs/:user", function(req, res){                      // ADD NEW POST AND REDIRECT TO INDEX PAGE
    // userID= req.params.user;

    Blog.create({
        userID: req.params.user,
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body

    }, function(err, newblog){
        if(!err){
            console.log("2. new blog added to database");
            console.log(newblog);
            res.redirect("/blogs/" + req.params.user);
        }

        else{
            console.log("2. error in adding new blog");
            res.render("new");
        }
    });
});

app.get("/blogs/:user/:id", function(req, res){                   // SHOW A PARTICULAR BLOG
    Blog.findById(req.params.id, function (err, foundblog) {
        if (!err) {
            console.log("3. Blog found");
            console.log(foundblog);
            res.render("show", { blog: foundblog, user: req.params.user });
        }
        else{
            console.log("3. Blog not found");
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){              // UPDATE A PARTICULAR BLOG
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (!err) {
            console.log("4.edit Blog found");
            console.log(foundBlog);
            res.render("edit", { blog: foundBlog });
        }
        else {
            console.log("4. edit Blog not found");
        }
    });
});

app.put("/blogs/:id", function(req, res){                   // PUT THE UPDATED BLOG TO DATABASE AND REDIRECT TO /blog/:id
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (!err) {
            console.log("5.Blog updated");
            console.log(req.body.blog);
            res.redirect("/blogs/"+req.params.id);
        }
        else {
            console.log("5. Problem in updating blog");
        }
    });
});

app.delete("/blogs/:id", function(req, res){                // DELETE A BLOG
    Blog.findByIdAndRemove (req.params.id, function(err,){
        if (!err) {
            console.log("6.Blog deleted");
            res.redirect("/blogs");
        }
        else {
            console.log("6. Problem in deleting blog");
        }
    }); 
});

 
//starting server code..............................
app.listen(3000, function () {
    console.log("Server started");
});
