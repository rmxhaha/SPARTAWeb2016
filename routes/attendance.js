var express = require("express");
var router = express.Router();
var dbpool = require('../conf/dbpool');

var mysql = require('promise-mysql');
var Promise = require('bluebird');

router.get('/toggle/', function(req, res, next) {
  var dayid = req.query.id;
  var nim = req.query.nim;
  var backURL = req.header("Referer");
  
  if( !dayid || dayid.length > 5 || !nim || nim.length != 8 )
    return res.redirect(backURL);
  
  var c = dbpool.getConnection();
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
    c.then(function(conn){ dbpool.releaseConnection(conn); });
    res.redirect(backURL);
  })
  
});

router.get('/', function(req, res, next) {
  if( !req.query.id )
    return res.redirect("../days/");
  
  var c = dbpool.getConnection();
  c.then( function(conn){
    return Promise.join( 
      conn.query("SELECT NIM, (SELECT COUNT(*) FROM kehadiran WHERE kehadiran.NIM = peserta.NIM AND day_id=?) as hadir FROM peserta ORDER BY NIM", [req.query.id]),
      conn.query("SELECT name FROM day WHERE id=?", [req.query.id])
    );
  })
  .then(function( result ){
    if( result[1].length == 0 ) {
     var err = new Error("Day doesn't exist");
     err.status = 406;
     throw err;
    }

    var rows = result[0];
    var dayname = result[1][0].name;

    res.render("attendance", {
    dayname : dayname,
    dayid : req.query.id,
    attendance : rows 
    });
  })
  .catch(function(err){
    res.render("error",err);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});

module.exports = router;


