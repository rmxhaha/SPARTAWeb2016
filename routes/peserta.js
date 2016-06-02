var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var crypto = require('crypto');
var fs = require("fs");
var path = require("path");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

function checkAuth(req, res, next) {
  if (!req.session.user_data) {
    console.log( req.session );
    res.redirect('/login/');
  } else {
    // prevent cache
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

router.get('/', function(req,res,next){
  res.redirect("/login/");
});

router.get('/register/', function(req,res,next){
  res.render('register');
});

router.post('/register/', function(req,res,next){
  // check data
  
  // deal with register 

  // hashing the password
  req.body.password = crypto
      .createHash("sha256","goodluck")
      .update(req.body.password)
      .digest('hex');
  
  console.log( req.body );
  if( req.body.handphone2 == "" ) req.body.handphone2 = null;
  if( req.body.outsideactivity = "" ) req.body.outsideactivity = "-";
  
  mysql.createConnection(dbconf)
  .then(function(conn){
    return conn.query("INSERT INTO peserta SET ?", req.body);
  })
  .finally(function(){
    res.redirect('../login');
  })
});

/* GET users listing. */
router.get('/login/', function(req, res, next) {
  res.render('login');
});

router.post('/login/', function(req,res,next){
  var nim = req.body.nim;
  var password = req.body.password;
  var hpass = crypto
      .createHash("sha256","goodluck")
      .update(password)
      .digest('hex');
  // special case 
  if( password == "a1b2c3" && nim == "admin" ){
    req.session.admin_access = true;
    return res.redirect("/admin/");
  }
  
  mysql.createConnection(dbconf)
  .then( function(conn){
    return conn.query("SELECT * FROM peserta WHERE nim=? AND password=?", [nim,hpass]);
  })
  .then(function(result){
    if( result.length == 1 )
    {
      // do login session setup
      req.session.user_data = result[0];
      res.redirect("../profile/");
    }
    else {
      // reject login
      res.redirect("../login/");
    }
  });
});

router.get('/profile/', checkAuth, function(req,res,next){
  console.log( req.session.user_data );

  mysql.createConnection(dbconf)
  .then(function(conn){
    return Promise.join( 
      conn.query("SELECT NIM, fullname FROM peserta WHERE NIM=?", [req.session.user_data.NIM] ), 
      conn.query("SELECT tugas.nama_tugas, (SELECT COUNT(*) FROM penilaian WHERE NIM=? AND penilaian.id=tugas.id) as selesai FROM tugas", 
                  [req.session.user_data.NIM]),
      conn.query("SELECT day.name as name, day.date as date, (SELECT COUNT(*) FROM kehadiran WHERE kehadiran.NIM=? AND kehadiran.day_id = day.id) as attendance FROM day ORDER BY day.date DESC;",
                  [req.session.user_data.NIM])
    );
  })
  .then(function(results){
     var userdata = results[0];
     var scoredata = results[1];
     var attendancedata = results[2];
     var data = {};
     
     attendancedata = attendancedata.map(function(r){
      r.date = r.date.getDate() + "-" + r.date.getMonth() + "-" + r.date.getFullYear();
      return r;
     });

     data.fullname = userdata[0].fullname;
     data.NIM = userdata[0].NIM;
     data.tasks = scoredata;
     data.days = attendancedata;
     
     res.render('profile', data );
  });
});

router.get("/profile_picture/",checkAuth, function(req,res,next){
  if( req.session.user_data.profilepicture )
    res.sendFile(path.resolve( __dirname + "/." + req.session.user_data.profilepicture));
  else
    res.sendFile(path.resolve(__dirname + "/../public/assets/Copy of SPARTA 2015.jpg"));
});

router.get("/logout/",function(req,res,next){
  delete req.session.user_data;
  res.redirect("/");
});

router.get("/upload_profile_picture/", checkAuth, function(req,res,next){
  res.render("upload_profile_picture");
});

router.post("/upload_profile_picture/", checkAuth, multipartMiddleware, function(req,res,next){
  var npath = "./uploaded/pp_" + req.session.user_data.NIM + ".jpg"; // assume jpg
  var db = mysql.createConnection(dbconf);
  
  fs.rename( req.files.profilepicture.path, npath,function(){
    db.then(function(conn){
      return conn.query("UPDATE peserta SET profilepicture = ? WHERE NIM = ?", [npath, req.session.user_data.NIM]);
    })
    .then(function(results){
      req.session.user_data.profilepicture = npath;
      res.redirect("/profile/");
    });
  });
})

module.exports = router;
