const mysql = require('mysql');

//local mysql db connection
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'curtiembre'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;