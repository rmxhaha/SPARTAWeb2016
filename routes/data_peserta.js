var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');

var mysql = require('promise-mysql');
var Promise = require('bluebird');

router.get("/:nim", function(req,res,next){
  var c = mysql.createConnection(dbconf);
  c.then(function(conn){
    return conn.query("SELECT * FROM peserta WHERE NIM=?;",[req.params.nim]);
  })
  .then(function(result){
    if( result.length == 0 )
      throw new Error("peserta not found");

    delete result[0]["password"];
    var val = result[0]["dateborn"];
    result[0]["dateborn"] = val.getDate() + "-" + val.getMonth() + "-" + val.getFullYear();;
  
    res.render("data_peserta", {data_peserta : result[0] });
  })
  .catch(function(err){
    res.render("error",err);
  });
  
});

module.exports = router;