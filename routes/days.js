var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');

var mysql = require('promise-mysql');
var Promise = require('bluebird');


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

router.get('/attendance/toggle', function(req, res, next) {
  var dayid = req.query.id;
  var nim = req.query.nim;
  var backURL = req.header("Referer");
  
  if( !dayid || dayid.length > 5 || !nim || nim.length != 8 )
    return res.redirect(backURL);
  
  var c = mysql.createConnection(dbconf);
  c.then(function(conn){
    return conn.query("DELETE FROM kehadiran WHERE NIM=? AND day_id=?",[nim,dayid]);
  })
  .then(function(result){
    if( result.affectedRows != 0 )
      return res.redirect(backURL);

    return c.then(function(conn){ 
      return conn.query("INSERT INTO kehadiran (`NIM`,`day_id`) VALUES (?,?)",[nim,dayid]); 
    });
  })
  .finally(function(){
    res.redirect(backURL);
  })
  
});

router.get('/attendance', function(req, res, next) {
  if( !req.query.id )
    return res.redirect("./");
  
   var c = mysql.createConnection(dbconf);
   c.then( function(conn){
      return Promise.join( 
        conn.query("SELECT NIM, (SELECT COUNT(*) FROM kehadiran WHERE kehadiran.NIM = peserta.NIM AND day_id=?) as hadir FROM peserta ORDER BY NIM", [req.query.id]),
        conn.query("SELECT name FROM day WHERE id=?", [req.query.id])
      );
   })
   .then(function( result ){
     if( result[1].length == 0 ) throw new Error("Day doesn't exist");

     var rows = result[0];
     var dayname = result[1][0].name;
     
     res.render("attendance", { 
      dayname : dayname,
      dayid : req.query.id,
      attendance : rows 
     });
   })
   .catch(function(err){
      console.log(err);
      res.redirect("/");
   });
});

module.exports = router;


