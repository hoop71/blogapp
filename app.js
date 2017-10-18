var bodyParser = require("body-parser"),
methorOverride = require("method-override"),
expressSanitizer = require('express-sanitizer'),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/blogapp", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methorOverride("_method"));
app.use(expressSanitizer());

// MoONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   // can enter placeholders for any strings
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES

app.get("/", function(req, res){
   res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
      if(err){
         console.log("ERROR");
      } else {
         res.render("index", {blogs: blogs});
      }
   });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
   // get data from form
   // create blog
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(err, newBlog){
      if(err){
         res.render("new");
      } else {
         // reddirect back to campground route
          res.redirect("/blogs");
      }
   });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
         res.redirect("/blogs");
      } else { 
         res.render("show", {blog: foundBlog});
      }
   });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
         res.render("/blogs");
      } else { 
         res.render("edit", {blog: foundBlog});
      }   
   });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
         res.redirect("/blogs");
      } else { 
         res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   // destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/blogs");
      } else {
         res.redirect("/blogs");
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("** The blogapp Server Has Started! **");
});