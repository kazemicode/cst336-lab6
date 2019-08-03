const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const port = 8080;
const ip = "0.0.0.0";
const tools = require("./tools.js");

app.set('view engine', 'ejs');

app.use(session({
  secret: "top secret!",
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({extended:true})); // allows us to parse POST params

// Routes
app.get("/", function(req, res){
 res.render("index");
});

app.post("/", async function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  
  let result = await tools.checkUsername(username);
  console.dir(result);
  let hashedPwd = "";
  
  // check if username is not empty string
  if(result.length > 0)
    {
      hashedPwd = result[0].password; // returned from checkUsername
    }
  
  let passwordMatch = await tools.checkPassword(password, hashedPwd);
  console.log(`passwordMatch: ${passwordMatch}`);
  if(passwordMatch){
    req.session.authenticated = true;
    res.render("welcome", {"username":username}); // welcome, user!
  }
  else{
    res.render("index", {"loginError":true}); // display unsuccessful message
  }
  
});

app.get("/myAccount", tools.isAuthenticated, function(req, res) {
  
    res.render("account");
  
});

app.get("/logout", function(req, res){
  req.session.destroy();
  res.redirect("/");
});

// Listeners
app.listen(port, ip, function() {
  console.log(`Running Express Server on ${ip}:${port}`);
});