var express = require('express');
var router = express.Router();
var dbpool = require('../conf/dbpool');
var mysql = require('promise-mysql');
var Promise = require('bluebird');

/* GET users listing. */
router.get('/', function(req,res,next){
  var c = dbpool.getConnection();
  
  c.then(function(conn){
    return conn.query("SELECT NIM, fullname, (SELECT COUNT(*) FROM penilaian WHERE penilaian.NIM = peserta.NIM ) as score FROM peserta");
  })
  .then(function(result){
    res.render('list_peserta', { list : result });
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});
router.get('/delete/',function(req,res,next){
  var c = dbpool.getConnection();
  var backURL = req.header("Referer");

  c.then(function(conn){
    return conn.query("DELETE FROM peserta WHERE NIM=?",[req.query.nim]);
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
    res.redirect(backURL);
  });
});
module.exports = router;
