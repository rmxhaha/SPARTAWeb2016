var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');
var mysql = require('mysql');



router.get('/', function(req, res, next) {
   var conn = mysql.createConnection(dbconf);
   conn.connect();
   conn.query("SELECT id,nama_tugas FROM tugas;", function(err,rows,fields){
      if(err) throw err;
      console.log( rows );
      res.render("tugas", { list_tugas : rows });
   });
   conn.end();   
});

router.post('/submit', function(req, res, next){
  // add tugas ke db di sini
  var conn = mysql.createConnection(dbconf);
  conn.connect();

  var query = "INSERT INTO tugas (`nama_tugas`) VALUES ('" + req.body.nama + "');";

  conn.query( query );

  conn.end();  
  res.redirect('./');
});

router.get('/submit', function(req,res){ res.redirect('./')});

router.get('/delete', function(req,res){
  res.redirect('./');
});

module.exports = router;


