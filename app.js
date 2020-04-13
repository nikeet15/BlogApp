//Ctrl+j to toggle terminal

//APP CONFIG............
var express                     = require("express");
var bodyparser                  = require("body-parser");
var methodOverride              = require("method-override");
var mongoose                    = require("mongoose"); 
var passport                    = require("passport");
var localStrategy               = require("passport-local");
var passportLocalMongoose       = require("passport-local-mongoose");
var Blog                        = require("./models/blogs");                       // .js is optional 
var Login                       = require("./models/logins");                     // taking in models in current app.js file

var app = express();                                            // express() return an object
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));                              //making public a static directory
app.set("view engine", "ejs");                                  //if written no need to write .ejs only write name of file
app.use(methodOverride("_method"));                             //ENABLES METHOD OVERRIDING

app.use(require("express-session")({
    secret: "rusty is the best and cutest dog",                 // secret code into which encoding is done
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());                                 // tells express to use passport
app.use(passport.session());

passport.use(new localStrategy(Login.authenticate()));
passport.serializeUser(Login.serializeUser());                  // responsible for encodeing data and putting it to a session
passport.deserializeUser(Login.deserializeUser());              // responsible for reading,taking,decoding data from session

mongoose.connect('mongodb://localhost:27017/EmployeeDB', {useNewUrlParser: true, 
        useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, 
        function (err) {
    if (!err)
        console.log("Database connection successfull");

    else
        console.log("error in DB cnnection" + err);
});

// ROUTES...................................................
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {                         // INDEX PAGE
    res.render("login");
});

app.post("/blogs", passport.authenticate("local", {
     
    successRedirect: "/blogs/all/sanat",
    failureRedirect: "/"
}), function(req, res){
});

app.get("/blogs/signup", function(req, res){
    res.render("signup");
});

app.post("/blogs/signup", function(req, res){
    Login.register(new Login({ username: req.body.login.username }), req.body.login.password, function(err, newUser){
        if(!err){
            console.log("2. user registered successfully");
            console.log(newUser);

            passport.authenticate("local")(req, res, function(){
                console.log("authentication successfull");
                res.redirect("/blogs/all/" + req.body.login.username);      
            });
        }

        else{
            console.log("2. error in adding new user to DB "+err)
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

app.post("/blogs/all/:user", function(req, res){                       // ADD NEW POST AND REDIRECT TO INDEX PAGE
    // username= req.params.user;

    Blog.create({
        username: req.params.user,
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

app.get("/blogs/all/:user/:id", function(req, res){                     // SHOW A PARTICULAR BLOG
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
    Blog.find({username: req.params.user}, function(err, foundBlog){
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

app.delete("/blogs/my/:user/:id", function(req, res){                    // DELETE A BLOG
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
 
// STARTING SERVER CODE................................
app.listen(3000, function () {
    console.log("Server started");
});
