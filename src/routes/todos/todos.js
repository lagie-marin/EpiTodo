const auth = require("../../middleware/auth")
const { getTodos, getTodosById, createTodos, deleteTodosById } = require("./todos.query")

module.exports = function(app, bcrypt) {
    app.get("/todos", auth, (req, res) => {
        getTodos(res);
    });

    app.get("/todos/:id", auth, vid, (req, res) => {
        getTodosById(req.params.id);
    });

    app.post("/todos", auth, (req, res) => {
        let title = req.params.title;
        let desc = req.params.description;
        let due = req.params.due_time;
        let id = req.params.user_id;
        let status = req.params.status;

        if (title == undefined || desc == undefined || due == undefined
        || id == undefined || status == undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        createTodos(res, title, desc, due, id, status);
    });

    app.delete("/todos/:id", auth, (req, res) => {
        deleteTodosById(res, req.params.id);
    });
}