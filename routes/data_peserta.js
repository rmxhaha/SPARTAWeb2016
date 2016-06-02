var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');
var fs = require("fs");
var path = require("path");

var mysql = require('promise-mysql');
var Promise = require('bluebird');


router.get("/profile_picture/:nim/", function(req,res,next){
  var local =  __dirname + "/.";
  var c = mysql.createConnection(dbconf);
  c.then(function(conn){
    return conn.query("SELECT profilepicture FROM peserta WHERE NIM=?",[req.params.nim]);
  })
  .then(function(rows){
    if( rows.length == 0 )
      return res.render("error", new Error("non exisitent"));
    if( rows[0].profilepicture )
      res.sendFile(path.resolve(local + rows[0].profilepicture ));
    else
      res.sendFile(path.resolve(__dirname + "/../public/assets/default2.jpg"));
  });
});

router.get("/:nim", function(req,res,next){
  var c = mysql.createConnection(dbconf);
  c.then(function(conn){
    return conn.query("SELECT * FROM peserta WHERE NIM=?;",[req.params.nim]);
  })
  .then(function(rows){
    console.log( rows );
    console.log( rows.length );
    if( rows.length == 0 )
      throw new Error("peserta not found");

    delete rows[0]["password"];
    var val = rows[0]["dateborn"];
    console.log( val );
    if( val instanceof Date )
      rows[0]["dateborn"] = val.getDate() + "-" + val.getMonth() + "-" + val.getFullYear();;
    rows[0]["profilepicture"] = "../profile_picture/" + rows[0].NIM;
  
    res.render("data_peserta", {data_peserta : rows[0] });
  })
  .catch(function(err){
    console.log(err);
    res.render("error",err);
  });
  
});

module.exports = router;