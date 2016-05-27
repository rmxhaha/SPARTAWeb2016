var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var crypto = require('crypto');

function checkAuth(req, res, next) {
  if (!req.session.user_data) {
    console.log( req.session );
    res.redirect('./login');
  } else {
    // prevent cache
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

router.get('/register', function(req,res,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  // check data
  
  // deal with register 

  // hashing the password
  req.body.password = crypto
      .createHash("sha256","goodluck")
      .update(req.body.password)
      .digest('hex');
  
  console.log( req.body );
  
  mysql.createConnection(dbconf)
  .then(function(conn){
    return conn.query("INSERT INTO peserta SET ?", req.body);
  })
  .finally(function(){
    res.redirect('./login');
  })
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
    return conn.query("SELECT * FROM peserta WHERE nim=? AND password=?", [nim,hpass]);
  })
  .then(function(result){
    if( result.length == 1 )
    {
      // do login session setup
      req.session.user_data = result[0];
      res.redirect("./profile");
    }
    else {
      // reject login
      res.redirect("./login");
    }
  });
});

router.get('/profile', checkAuth, function(req,res,next){
  console.log( req.session.user_data );
  
  mysql.createConnection(dbconf)
  .then(function(conn){
    return Promise.join( 
      conn.query("SELECT NIM, fullname FROM peserta WHERE NIM=?", [req.session.user_data.NIM] ), 
      conn.query("SELECT tugas.nama_tugas, (SELECT COUNT(*) FROM penilaian WHERE NIM=? AND penilaian.id=tugas.id) as selesai FROM tugas", 
                  [req.session.user_data.NIM]) 
    );
  })
  .then(function(results){
     var userdata = results[0];
     var scoredata = results[1];
     var data = {};

     data.fullname = userdata[0].fullname;
     data.NIM = userdata[0].NIM;
     data.tasks = scoredata;
     data.days = [
      { name : "Day #1", attendance : 1 }
     ];
     
     res.render('profile', data );
  });
});

module.exports = router;