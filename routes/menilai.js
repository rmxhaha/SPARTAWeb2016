var express = require('express');
var router = express.Router();
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var Promise = require('bluebird');

/* GET users listing. */
router.get('/peserta/:nim', function(req, res, next) {

  mysql.createConnection(dbconf)
  .then(function(conn){
     var getUserQuery = "SELECT NIM, fullname FROM peserta WHERE NIM=" + req.params.nim;
     var getScoreQuery = "SELECT tugas.id, tugas.nama_tugas, (SELECT COUNT(*) FROM penilaian WHERE NIM="+req.params.nim+" AND penilaian.id=tugas.id) as selesai FROM tugas";
     console.log( getUserQuery );
     console.log( getScoreQuery );
     return Promise.join( conn.query(getUserQuery), conn.query(getScoreQuery) )
  })
  .then(function(results){
     var userdata = results[0];
     var scoredata = results[1];
     var data = {};
     data.nama = userdata[0].fullname;
     data.NIM = userdata[0].NIM;
     data.penilaian = scoredata.map(function(s){ return [s.nama_tugas, s.selesai, s.id] });
     console.log( data );
     res.render('menilai', data );
  });
});

router.get('/toggle/', function(req,res,next){
   var nim = req.query.nim;
   var tugasid = req.query.tid;
   var backURL = req.header("Referer");

   console.log( nim + " " + tugasid );
   if( !nim || nim.length != 8 || !tugasid || tugasid.length > 5 )
     return res.redirect("/");
   
   var c = mysql.createConnection(dbconf)
   c.then( function(conn){
      return conn.query("DELETE FROM penilaian WHERE NIM=? AND id=?",[nim,tugasid]);
   })
   .then( function(result){
      if( result.affectedRows != 0 )
        return res.redirect(backURL);
      return c.then( function(conn){ conn.query("INSERT INTO penilaian (`NIM`,`id`) VALUES (?,?)", [nim,tugasid]) });
   })
   .finally(function(){
      res.redirect(backURL);
   });
});

module.exports = router;
