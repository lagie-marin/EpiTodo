const mysql = require('mysql2');

const dbconnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbconnection.connect(function(err) {
    if (err)
        console.log(`Error connect database :\n${err.stack}`);
    else
        console.log(`Database connected`);
});
module.exports = dbconnection;