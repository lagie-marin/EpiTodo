const auth = require("../../middleware/auth");
const { getUsers, getTodos, getInfoUser, rmUserById } = require("./user.query");

module.exports = function(app, bcrypt) {
    app.get("/user", auth, (req, res) => {
        getUsers(res);
    });

    app.get("/user/todos", auth, (req, res) => {
        getTodos(res, req.user);
    });

    app.get("/users/:info", auth, (req, res) => {
        getInfoUser(res, req.params.info);
    });

    app.delete("/users/:id", auth, (req, res) => {
        rmUserById(res, req.params.id)
    });
}