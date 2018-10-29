/********************************************************/
/***** Connect to MySQL *****/
/********************************************************/
var mysql = require('mysql');
var config = require('./config');

var dbConfig = {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    debug: config.db.debug
};

var connection;

function handleDisconnect() {
    /*
     * Recreate the connection, since
     * the old one cannot be reused.
     */
    connection = mysql.createPool(dbConfig);

    /* 
     * Connection to the MySQL server is usually
     * lost due to either server restart, or a
     * connnection idle timeout
     */
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect()

module.exports = connection;