const { validate } = require('email-validator');
const { checkAccountMail, getAccountMail, register } = require('../user/user.query');
const { logs } = require('../../utils/Logger');

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

        if (mail == undefined || name == undefined || fn == undefined || mdp == undefined)
            res.status(400).json({"msg":"there is information missing"});
        else if (mail.length == 0 || name.length == 0 || fn.length == 0)
            res.status(400).json({"msg": "email, name and firstname is required"});
        else if (!validate(mail))
            res.status(400).json({"msg": "Email is not valid"});
        else if (name == fn)
            res.status(400).json({"msg": "Name and surname must be different"});
        else if (name == mdp || fn == mdp || mail == mdp)
            res.status(400).json({"msg": "The password must be different from the name, first name and email"});
        else if (mdp.length < 8)
            res.status(400).json({"msg": "Password must contain at least 8 characters"});
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,}$/.test(mdp))
            res.status(400).json({"msg": "Password must contain lower case, upper case, number and special characters"});
        else {
            mdp = bcrypt.hashSync(mdp, 10);
            logs(`mdp: ${mdp}`);
            checkAccountMail(res, mail, nb => {
                if (nb == 84)
                    res.status(403).json({ "msg": "Account already exists" });
                else
                    register(res, mail, mdp, name, fn);
            });
        }
    });
}