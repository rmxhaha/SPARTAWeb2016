var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');

var mysql = require('promise-mysql');


router.get('/', function(req, res, next) {

   var c = mysql.createConnection(dbconf);
   c.then( function(conn){
      return conn.query("SELECT id,nama_tugas FROM tugas;");
   })
   .then(function( rows ){
     res.render("tugas", { list_tugas : rows });
   })
   .catch(function(err){
      console.log(err);
      res.redirect("/");
   });
   
});

router.post('/submit', function(req, res, next){
  // add tugas ke db di sini
  var c = mysql.createConnection(dbconf);
  var query = "INSERT INTO tugas (`nama_tugas`) VALUES (?);";

  c.then( function(conn){
     conn.query( query, [req.body.nama]);
  })
  .finally(function(){
     res.redirect("./");
  });
});

router.get('/submit', function(req,res){ res.redirect('./')});

router.get('/delete', function(req,res){
  var c = mysql.createConnection(dbconf);
  if( !req.query.id || req.query.id.length > 5 ) return res.redirect("./");
  
  c.then( function(conn){
       conn.query("DELETE FROM tugas WHERE id=?", [req.query.id]);
  })
  .finally(function(){
    res.redirect("./");
  });
  
});

module.exports = router;


