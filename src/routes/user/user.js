const auth = require("../../middleware/auth");
const { getUsers, getTodos, getInfoUser, rmUserById, updateUserInfo } = require("./user.query");

module.exports = function(app, bcrypt) {
    app.get("/user", auth, (req, res) => {
        getUsers(res);
    });

    app.get("/user/todos", auth, (req, res) => {
        getTodos(res, req.user);
    });

    app.get("/users/:id", auth, (req, res) => {
        getInfoUser(res, req.params.id);
    });

    app.get("/users/:email", auth, (req, res) => {
        getInfoUser(res, req.params.email);
    });

    app.delete("/users/:id", auth, (req, res) => {
        rmUserById(res, req.params.id)
    });

    app.put("/users/:id", auth, (req, res) => {
        var id = req.params.id;
        var mail = req.body["email"];
        var name = req.body["name"];
        var fn = req.body["firstname"];
        var mdp = req.body["password"];

        if (id == undefined || mail == undefined || name == undefined
        || fn == undefined || mdp == undefined) {
            res.status(500).json({"msg":"Internal server error"});
            return;
        }
        mdp = bcrypt.hashSync(mdp, 10);
        updateUserInfo(res, id, mail, mdp, name, fn);
    });
}
