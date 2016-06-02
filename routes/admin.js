var express = require("express");
var router = express.Router();
var dbconf = require('../conf/db');

var mysql = require('promise-mysql');
var Promise = require('bluebird');

var list_peserta = require('./list_peserta');
var data_peserta = require('./data_peserta');
var menilai = require('./menilai');
var tugas = require('./tugas');
var days = require('./days');
var attendance = require('./attendance');

function checkAdminAuth(req, res, next) {
  if (!req.session.admin_access) {
    res.redirect('/login/');
  } else {
    // prevent cache
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

router.use('/tugas', checkAdminAuth, tugas);
router.use('/list_peserta',checkAdminAuth,  list_peserta );
router.use('/data',checkAdminAuth,  data_peserta );
router.use('/menilai',checkAdminAuth,  menilai );
router.use('/days',checkAdminAuth,  days );
router.use('/attendance',checkAdminAuth,  attendance );
router.get('/',checkAdminAuth,  function(req,res,next){
  res.render("admin"); 
});
router.get('/logout/',checkAdminAuth,  function(req,res,next){
  req.session.admin_access = false;
  res.redirect("/");
});

module.exports = router;