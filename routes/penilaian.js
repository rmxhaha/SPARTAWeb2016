var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('penilaian', { nama: 'Candra Ramsi', NIM : '13514090', penilaian : [["Tugas #1",1]] });
});

module.exports = router;
