/********************************************************/
/***** Model Init *****/
/********************************************************/
var dbConnect = require('../dbConnect');

module.exports = {
    Users: require('./Users')(dbConnect)
}