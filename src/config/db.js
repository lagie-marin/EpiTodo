const mysql = require('mysql2');
const logger = require("../utils/Logger");

const dbconnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbconnection.connect(function(err) {
    if (err)
        logger.error(`Error connect database :\n${err.stack}`);
    else
        logger.serveur(`Database connected`);
});
module.exports = dbconnection;