const { checkAccountMail, getAccountMail, register } = require('../routes/user/user.query');
const { logs } = require('../utils/Logger');

module.exports = function (app, bcrypt) {
    app.post("/login", (req, res) => {
        var mail = req.body["email"];
        var mdp = req.body["password"];

        if (mail == undefined || mdp == undefined) {
            res.status(500).json({"msg":"internal server error"});
            return;
        }
        getAccountMail(res, mail, mdp, bcrypt, nb => {
            if (nb == 84)
                res.status(401).json({"msg" : "Invalid Credentials"});
            else
                res.status(200).json({ "token": "Token of the newly logged in user" });
        });
    });

    app.post("/register", (req, res) => {
        var mail = req.body["email"];
        var name = req.body["name"];
        var fn = req.body["firstname"];
        var mdp = req.body["password"];

        logs("ici\n");
        if (mail == undefined || name == undefined || fn == undefined || mdp == undefined) {
            res.status(500).json({"msg":"internal server error"});
            return;
        }
        mdp = bcrypt.hashSync(mdp, 10);
        checkAccountMail(res, mail, nb => {
            if (nb == 84)
                res.status(409).json({ "msg": "Account already exists" });
            else
                register(res, mail, mdp, name, fn);
        });
    })
}