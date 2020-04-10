//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");
var app = express();                                 // express() return an object 

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));                  //making public a static directory
app.use(express.static("models"));
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

var Blog= require("./models/blogs");                // .js is optional 
var Login= require("./models/logins");              // taking in models in current app.js file

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
                res.redirect("/blogs/all/" + req.body.login.userID);
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
            res.redirect("/blogs/all/" + req.body.login.userID);
        }

        else {
            console.log("2. error in adding new user");
            res.redirect("/blogs/signup");
        }
    });
});

app.get("/blogs/all/:user", function(req, res){
    Blog.find({}, function(err, blogs)
    {
        if(!err){
            console.log("3. retrieve data successfull");
            res.render("index", {blogs: blogs, user: req.params.user});
        }
        else
            console.log("3. not able to retrieve from database");
    });
});

app.get("/blogs/:user/new", function(req, res) {                       // NEW POST ADDING PAGE
    res.render("new", {user: req.params.user});
});

app.post("/blogs/all/:user", function(req, res){                      // ADD NEW POST AND REDIRECT TO INDEX PAGE
    // userID= req.params.user;

    Blog.create({
        userID: req.params.user,
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body

    }, function(err, newblog){
        if(!err){
            console.log("4. new blog added to database");
            console.log(newblog);
            res.redirect("/blogs/all/" + req.params.user);
        }

        else{
            console.log("4. error in adding new blog");
            res.render("new");
        }
    });
});

app.get("/blogs/all/:user/:id", function(req, res){                   // SHOW A PARTICULAR BLOG
    Blog.findById(req.params.id, function (err, foundblog) {
        if (!err) {
            console.log("5. Blog found");
            console.log(foundblog);
            res.render("show", { blog: foundblog, user: req.params.user });
        }
        else{
            console.log("5. Blog not found");
        }
    });
});

app.get("/blogs/my/:user", function(req, res){                          // SHOW ONLY USER'S BLOGS
    Blog.find({userID: req.params.user}, function(err, foundBlog){
        if (!err) {
            console.log("6. Blog found");
            console.log(foundBlog);
            res.render("index", { blogs: foundBlog, user: req.params.user });
            // res.send("reached my blogs page");
        }
        else {
            console.log("6. my Blog not found");
        }
    });
});

app.get("/blogs/my/:user/:id/edit", function(req, res){                 // UPDATE A PARTICULAR BLOG
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (!err) {
            console.log("7.edit Blog found");
            console.log(foundBlog);
            res.render("edit", { blog: foundBlog, user: req.params.user });
        }
        else {
            console.log("7. edit Blog not found");
        }
    });
});

app.put("/blogs/all/:user/:id", function(req, res){                     // PUT THE UPDATED BLOG TO DATABASE AND REDIRECT TO /blog/all/:user/:id
    Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.blog.title,
        image: req.body.blog.image,
        body: req.body.blog.body

    }, function(err, updatedBlog){
        if (!err) {
            console.log("8.Blog updated");
            console.log(req.body.blog);
            res.redirect("/blogs/all/" + req.params.user+ "/" +req.params.id);
        }
        else {
            console.log("8. Problem in updating blog");
        }
    });
});

app.delete("/blogs/my/:user/:id", function(req, res){                       // DELETE A BLOG
    Blog.findByIdAndRemove (req.params.id, function(err,){
        if (!err) {
            console.log("9.Blog deleted");
            res.redirect("/blogs/all/" + req.params.user);
        }
        else {
            console.log("9. Problem in deleting blog");
        }
    }); 
});

 
//starting server code..............................
app.listen(3000, function () {
    console.log("Server started");
});
