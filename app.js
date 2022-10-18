require('dotenv').config();//for enviroment variable (to store secret data)
const express = require("express"); //server
const bodyParser = require("body-parser"); //to get data from FORMS
const ejs = require("ejs");// to use templates
const mongoose = require("mongoose"); //database
const encrypt = require("mongoose-encryption")//to encrypt user password

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB");
//////////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// to encrypt password - begin
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); // only the field 'password' will be encrypted
// process.env.SECRET ==> accessing the variable in the .env file (it is there for security)
// when .SAVE is called, mongoose will encrypted the field Password
// when .FIND is called, mongoose will decrypt the field password
//to encrypt password - end

const User = new mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else{
      res.render("secrets");
    }
  })
});

app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, foundUser){
    if (err) {
      console.log(err);
    }else{
      if (foundUser) {
        if(foundUser.password === req.body.password){
          res.render("secrets");
        }
      }
    }
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000, function(req, res){
  console.log("Server started on port 3000");
})
