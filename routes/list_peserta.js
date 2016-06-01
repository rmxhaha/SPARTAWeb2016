var express = require('express');
var router = express.Router();
var dbconf = require('../conf/db');
var mysql = require('promise-mysql');
var Promise = require('bluebird');

/* GET users listing. */
router.get('/', function(req,res,next){
  mysql.createConnection(dbconf)
  .then(function(conn){
    return conn.query("SELECT NIM, fullname, (SELECT COUNT(*) FROM penilaian WHERE penilaian.NIM = peserta.NIM ) as score FROM peserta");
  })
  .then(function(result){
    res.render('list_peserta', { list : result });
  });
});
module.exports = router;
