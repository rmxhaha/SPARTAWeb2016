var express = require("express");
var router = express.Router();


router.get('/', function(req, res, next) {
   res.render("tugas", { list_tugas : [[1,"tugas #1"]]});
});

router.post('/submit', function(req, res, next){
  // add tugas ke db di sini
  
  res.redirect('./');
});
router.get('/submit', function(req,res){ res.redirect('./')});
router.get('/delete', function(req,res){
  res.redirect('./');
});

module.exports = router;


