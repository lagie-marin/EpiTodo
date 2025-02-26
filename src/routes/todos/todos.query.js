const jwt = require("jsonwebtoken");
const db = require("../../config/db");

module.exports = { getTodos, getTodosById, createTodos, deleteTodosById, updateTodosById };

function getTodos(res)
{
    db.query("SELECT * FROM todo", (err, result, fields) => {
        res.status(200).json(result);
    });
}

function getTodosById(res, id)
{
    db.execute("SELECT * FROM todo WHERE id=?", [id], (err, result, fields) => {
        res.status(200).json(result);
    });
}

function createTodos(res, title, desc, due, id, status)
{
    db.execute("INSERT INTO todo (title,description,due_time,user_id,status) VALUES (?,?,?,?,?)", [title, desc, due, id, status], (err, result, fields) => {
        var id_task = results["insertId"];
        db.execute('SELECT * FROM `todo` WHERE id = ?', [id_task], function(err, results, fields) {
            res.status(200).json(results);
        });
    });
}

function deleteTodosById(res, id)
{
    db.execute("DELETE FROM todo WHERE id=?", [id], (err, result, fields) => {
        res.status(200).json({"msg": `Successfully deleted record number: ${id}`});
    });
}

function updateTodosById(res, title, desc, due, user_id, status, id)
{
    db.execute("UPDATE todo SET title=?, description=?, due_time=?, user_id=?, status=? WHERE id=?", [title, desc, due, user_id, status, id], (err, result, fields) => {
        db.execute("SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?", [id], function(err, results, fields) {
            res.status(200).json(results);
        });
    });
}