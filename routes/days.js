var express = require("express");
var router = express.Router();
var dbpool = require('../conf/dbpool');

var mysql = require('promise-mysql');
var Promise = require('bluebird');


router.get('/', function(req, res, next) {

  var c = dbpool.getConnection();
  c.then( function(conn){
    return conn.query("SELECT id,name,date FROM day ORDER BY date DESC, id DESC;");
  })
  .then(function( rows ){
   var list_days = rows.map( function(r){
     r.date = r.date.getDate() + "-" + r.date.getMonth() + "-" + r.date.getFullYear();
     return r;
   });
   
   res.render("days", { list_days : list_days });
  })
  .catch(function(err){
    console.log(err);
    res.redirect("/");
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
   
});


router.post('/submit', function(req, res, next){
  var backURL = req.header("Referer");
  if( !req.body.name || !req.body.date )
    return res.redirect("./");
  var c = dbpool.getConnection();
  var query = "INSERT INTO day (`name`,`date`) VALUES (?,?);";

  c.then( function(conn){
     conn.query( query, [req.body.name, req.body.date]);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
    res.redirect(backURL);
  });
});

router.get('/submit/', function(req,res){
  var backURL = req.header("Referer");
  res.redirect(backURL);
});

router.get('/delete/', function(req,res){
  var backURL = req.header("Referer");
  var c = dbpool.getConnection();
  if( !req.query.id || req.query.id.length > 5 ) return res.redirect("./");
  
  c.then( function(conn){
    conn.query("DELETE FROM day WHERE id=?", [req.query.id]);
  })
  .catch(function(err){
    res.render('error',err);
  })
  .then(function(){
    res.redirect(backURL);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});


module.exports = router;


