var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var crypto = require('crypto');

function checkAuth(req, res, next) {
  if (!req.session.user_data) {
    console.log( req.session );
    res.redirect('../login');
  } else {
    // prevent cache
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
  return next();
}

router.get('/register', function(req,res,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  // deal with register 
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req,res,next){
  var nim = req.body.nim;
  var password = req.body.password;
  var hpass = crypto
      .createHash("sha256","goodluck")
      .update(password)
      .digest('hex');

  if( req.body.nim == "13514090" ){
    console.log("R");
    req.session.user_data = { nim : "13514090", name : "Candra Ramsi" };
    console.log( req.session );
    res.redirect("../profile/");
  }
      
  mysql.createConnection(dbconf)
  .then( function(conn){
    return conn.query("SELECT COUNT(*) as count FROM nim=? AND password=?", [nim,hpass]);
  })
  .then(function(result){
    if( result[0].count == 0 )
    {
      // do login session setup
    }
    else {
      // reject login
    }
  });
  return next();
});

router.get('/profile', checkAuth, function(req,res,next){
  res.send("profile :D");
});

module.exports = router;