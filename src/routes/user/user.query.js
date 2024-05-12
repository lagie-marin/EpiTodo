const db = require("../../config/db");

module.exports = { getUsers, getTodos, register, getAccountByName };

function getUsers(res, id)
{
    db.query("SELECT * FROM user", (err, result, fields) => {
        res.status(200).json(result);
    });
}

function getTodos(res, id)
{
    db.query("SELECT * FROM todo WHERE user_id = ?", [id], (err, result, fields) => {
        res.status(200).json(result);
    });
}

function register(res, mail, mdp, name, fn)
{
    db.execute("INSERT INTO user (email, password, name, firstname) VALUES (?,?,?,?)", [mail, mdp, name, fn], (err, result, fields) => {
        res.status(200).json(result);
    });
}

function getAccountByName(res, name, callback)
{
    db.execute("SELECT * FROM user WHERE name = ?", [name], (err, result, fields) => {
        if (result.length == 0)
            callback(0);
        else
            callback(84);
    })
}