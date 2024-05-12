const db = require("../../config/db");

module.exports = { getUsers, getTodos, register };

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
    db.query("INSERT INTO user (email, password, name, firstname) VALUES (?,?,?,?)", [mail, mdp, name, fn], (err, result, fields) => {
        res.status(200).json(result);
    });
}