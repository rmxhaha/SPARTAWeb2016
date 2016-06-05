var express = require("express");
var router = express.Router();
var dbpool = require('../conf/dbpool');

var mysql = require('promise-mysql');


router.get('/', function(req, res, next) {

   var c = dbpool.getConnection();
   c.then( function(conn){
      return conn.query("SELECT id,nama_tugas FROM tugas;");
   })
   .then(function( rows ){
     res.render("tugas", { list_tugas : rows });
   })
   .catch(function(err){
     res.render("error",err);
   })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
   
});

router.post('/submit/', function(req, res, next){
  // add tugas ke db di sini
  var c = dbpool.getConnection();
  var query = "INSERT INTO tugas (`nama_tugas`) VALUES (?);";
  var backURL = req.header("Referer");

  c.then( function(conn){
     conn.query( query, [req.body.nama]);
  })
  .catch(function(err){
    res.render("error",err);
  })
  .then(function(){
    res.redirect(backURL);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});

router.get('/submit/', function(req,res){ res.redirect(req.header("Referer"))});

router.get('/delete/', function(req,res){
  var c = dbpool.getConnection();
  var backURL = req.header("Referer");
  if( !req.query.id || req.query.id.length > 5 ) return res.redirect("./");
  
  c.then( function(conn){
   conn.query("DELETE FROM tugas WHERE id=?", [req.query.id]);
  })
  .catch(function(err){
    res.render("error",err);
  })
  .then(function(){
    res.redirect(backURL);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});

module.exports = router;


