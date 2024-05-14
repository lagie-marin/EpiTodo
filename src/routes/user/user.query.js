const db = require("../../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { error, logs } = require("../../utils/Logger");

dotenv.config();

module.exports = { getUsers, getTodos, register, checkAccountName, checkAccountMail, getAccountMail, getInfoUser, rmUserById, updateUserInfo };

function getUsers(res)
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
        if (err) {
            error(err);
            res.status(500).json({"msg": "Internal server error"});
            return;
        }
        res.status(200).json(jwt.sign({email:mail, password:mdp}, process.env.SECRET));
    });
}

function checkAccountName(res, name, callback)
{
    db.execute("SELECT * FROM user WHERE name = ?", [name], (err, result, fields) => {
        if (result.length == 0)
            callback(0);
        else
            callback(84);
    });
}

function checkAccountMail(res, mail, callback)
{
    db.execute("SELECT * FROM user WHERE email = ?", [mail], (err, result, fields) => {
        if (result.length == 0)
            callback(0);
        else
            callback(84);
    });
}

function getAccountMail(res, mail, mdp, bcrypt, callback)
{
    db.execute("SELECT password, id FROM user WHERE email = ?", [mail], (err, result, fields) => {
        if (result.length == 0)
            callback(84);
        else {
            var mdp2 = result[0].password;

            if(bcrypt.compareSync(mdp, mdp2)) {
                const token = jwt.sign({email:mail, id:result[0].id}, process.env.SECRET);
                res.json({token});
                callback(0);
            }
            else callback(84);
        }
    });
}

function getInfoUser(res, info)
{
    db.execute("SELECT * FROM user WHERE id=?", [info], (err, result, fields) => {
        if (result.length > 0)
            res.status(200).json(result);
        else {
            db.execute("SELECT * FROM user WHERE email=?", [info], (err, result, fields) => {
                res.status(200).json(result);
            });
        }
    });
}

function rmUserById(res, id)
{
    db.execute("DELETE FROM user WHERE id=?", [id], (err, result, fields) => {
        res.status(200).json({"msg" : `Successfully deleted record number: ${id}`});
    });
}

function updateUserInfo(res, id, mail, mdp, name, fn)
{
    db.execute("UPDATE user SET email=?, password=?, name=?, firstname=? WHERE id=?", [mail, mdp, name, fn], (err, result, fields) => {
        db.execute("SELECT id, email, password, created_at, firstname, name FROM user WHERE id=?", [id], (err, result, fields) => {
            res.status(200).json(result);
        });
    });
}