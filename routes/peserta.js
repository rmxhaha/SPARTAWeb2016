var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var crypto = require('crypto');



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
});

module.exports = router;