var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');

var mysql = require('promise-mysql');


router.get('/', function(req, res, next) {

   var c = mysql.createConnection(dbconf);
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
   });
   
});

router.post('/submit', function(req, res, next){
  if( !req.body.name || !req.body.date )
    return res.redirect("./");
  var c = mysql.createConnection(dbconf);
  var query = "INSERT INTO day (`name`,`date`) VALUES (?,?);";

  c.then( function(conn){
     conn.query( query, [req.body.name, req.body.date]);
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
       conn.query("DELETE FROM day WHERE id=?", [req.query.id]);
  })
  .finally(function(){
    res.redirect("./");
  });
  
});

module.exports = router;


