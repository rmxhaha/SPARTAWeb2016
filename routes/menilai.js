var express = require('express');
var router = express.Router();
var dbpool = require('../conf/dbpool');
var mysql = require('promise-mysql');
var Promise = require('bluebird');

router.get('/toggle/', function(req,res,next){
   var nim = req.query.nim;
   var tugasid = req.query.tid;
   var backURL = req.header("Referer");

   console.log( nim + " " + tugasid );
   if( !nim || nim.length != 8 || !tugasid || tugasid.length > 5 )
     return res.json({error : "input not allowed"});
   
   var c = dbpool.getConnection();
   c.then( function(conn){
      return conn.query("DELETE FROM penilaian WHERE NIM=? AND id=?",[nim,tugasid]);
   })
   .then( function(result){
      if( result.affectedRows != 0 )
        return res.json({ state : 0 });
      else{
        res.json({ state : 1 });
        return c.then( function(conn){ conn.query("INSERT INTO penilaian (`NIM`,`id`) VALUES (?,?)", [nim,tugasid]) })
      }
   })
   .finally(function(){
      c.then(function(conn){ dbpool.releaseConnection(conn); });
   });
});

router.get('/:nim', function(req, res, next) {

  var c = dbpool.getConnection();
  
  c.then(function(conn){
     return Promise.join( 
      conn.query("SELECT NIM, fullname FROM peserta WHERE NIM=?",[req.params.nim]), 
      conn.query("SELECT tugas.id, tugas.nama_tugas, (SELECT COUNT(*) FROM penilaian WHERE NIM=? AND penilaian.id=tugas.id) as selesai FROM tugas",[req.params.nim])
    );
  })
  .then(function(results){
     var userdata = results[0];
     var scoredata = results[1];
     var data = {};
     data.nama = userdata[0].fullname;
     data.NIM = userdata[0].NIM;
     data.penilaian = scoredata;
     console.log( data );
     res.render('menilai', data );
  })
  .finally(function(){
    c.then(function(conn){ dbpool.releaseConnection(conn); });
  });
});


module.exports = router;
