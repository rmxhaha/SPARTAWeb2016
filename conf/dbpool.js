var mysql = require('promise-mysql');
var conf = require('./db');

var pool = mysql.createPool(conf);

module.exports = pool;