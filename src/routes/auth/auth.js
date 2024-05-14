const { logs } = require('../../utils/Logger');
const { checkAccountMail, getAccountMail, register } = require('../user/user.query');

module.exports = function (app, bcrypt) {
    app.post("/login", (req, res) => {
        var mail = req.body["email"];
        var mdp = req.body["password"];

        if (mail == undefined || mdp == undefined) {
            res.status(500).json({"msg":"internal server error"});
            return;
        }
        getAccountMail(res, mail, mdp, bcrypt, (nb) => {
            if (nb == 84)
                res.status(401).json({"msg" : "Invalid Credentials"});
        });
    });

    app.post("/register", (req, res) => {
        var mail = req.body["email"];
        var name = req.body["name"];
        var fn = req.body["firstname"];
        var mdp = req.body["password"];

        if (mail == undefined || name == undefined || fn == undefined || mdp == undefined ||
            mail.length == 0 || name.length == 0 || fn.length == 0)
            res.status(400).json({"msg":"there is information missing"});
        else {
            mdp = bcrypt.hashSync(mdp, 10);
            checkAccountMail(res, mail, nb => {
                if (nb == 84)
                    res.status(403).json({ "msg": "Account already exists" });
                else
                    register(res, mail, mdp, name, fn);
            });
        }
    });
}