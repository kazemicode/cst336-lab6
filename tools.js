const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
var tools = module.exports = {
// Functions
/** 
* Checks if password matches the hashValue from DB
* returns result of call to bcrypt.compare
* @param {string} password {string} hashedValue
* @return {boolean}
*/
checkPassword: function(password, hashedValue) {
  return new Promise( function(resolve, reject){
    bcrypt.compare(password, hashedValue, function(err, result) {
      console.log(`Result: ${result}`);
      resolve(result);
    });
  });
},

/** 
* Checks if username exists in db
* if found, returns corresponding record
* @param {string} username
* @return {array of objects}
*/
checkUsername: function(username){
  let sql="SELECT * FROM users WHERE username = ?";
  return new Promise( function(resolve, reject) {
    let conn = tools.createDBConnection();
    conn.connect(function(err) {
      if(err) throw err;
      conn.query(sql, [username], function(err, rows, fields){
        if (err) throw err;
        console.log(`Rows found: ${rows.length}`)
        resolve(rows);
      }); // query
    }); // connect
  }); // promise
}, // checkUsername

/** 
* Checks if user is authenticated
* if not authenticated, redirect to root
* if yes, keep going with the next line
* in the function that made the call
*/
isAuthenticated: function(req, res, next){
  if(!req.session.authenticated){
    res.redirect("/");
  }
  else{
    next();
  }
},

/** 
* Creates DB connection 
*/
createDBConnection: function() {
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "authentication"
  });
  console.log(`Connected to: ${conn.database}`);
     return conn;             
}
}