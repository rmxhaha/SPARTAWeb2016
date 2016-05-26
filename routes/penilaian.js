var express = require('express');
var router = express.Router();
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var Promise = require('bluebird');

/* GET users listing. */
router.get('/:nim', function(req, res, next) {

  mysql.createConnection(dbconf)
  .then(function(conn){
     var getUserQuery = "SELECT NIM, nama_peserta FROM peserta WHERE NIM=" + req.params.nim;
     var getScoreQuery = "SELECT tugas.nama_tugas, (SELECT COUNT(*) FROM penilaian WHERE NIM="+req.params.nim+" AND penilaian.id=tugas.id) as selesai FROM tugas";
     console.log( getUserQuery );
     console.log( getScoreQuery );
     return Promise.join( conn.query(getUserQuery), conn.query(getScoreQuery) )
  })
  .then(function(results){
     var userdata = results[0];
     var scoredata = results[1];
     var data = {};
     data.nama = userdata[0].nama_peserta;
     data.NIM = userdata[0].NIM;
     data.penilaian = scoredata.map(function(s){ return [s.nama_tugas, s.selesai] });
     console.log( data );
     res.render('penilaian', data );
  });
  
});

module.exports = router;
