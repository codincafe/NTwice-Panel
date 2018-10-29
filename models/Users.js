/********************************************************/
/***** User Model *****/
/********************************************************/
var bcrypt = require('bcrypt');
var saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

var Users = function (connection) {
    var module = {}

    /*
     * User login
     * 
     * Ex. Options
     * {
     *  username: admin,
     *  password: password@123
     * }
     */
    module.Login = function (options, callback) {
        connection.query("SELECT * FROM phppos_employees WHERE username = ? LIMIT 1", [options.username], function (err, user) {
            if (err) {
                callback(err)
            } else {
                var comparePass = bcrypt.compareSync(options.password, user[0].password);
                if (comparePass) {
                    callback(false, user[0])
                } else {
                    callback(true)
                }
            }
        })
    }

    /*
     * User login
     * 
     * Ex. Options
     * {
     *  username: admin,
     *  password: password@123
     * }
     */
    module.ResetPassword = function (options, callback) {
        connection.query("INSERT INTO phppos_employees_reset_password key = ?, employee_id = (SELECT id FROM phppos_employees WHERE username = ?), expire = DATE_ADD(NOW(), INTERVAL 1 HOUR)", [options.username], function (err, user) {
            if (err) {
                callback(err)
            } else {
                callback(false)
            }
        })
    }

    return module;
};

module.exports = Users;