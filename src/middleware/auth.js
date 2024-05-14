const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const headersauth = req.headers['authorization'];

    if (!headersauth)
        return res.status(498).json({"msg":"No token, authorization denied"});
    const token = headersauth.replace("Bearer ", "");
    jwt.verify(token, process.env.SECRET, (err, result) => {
        if (err)
            return res.status(498).json({"msg":"Token is not valid"});
        req.iduser = result["id"];
        next();
    });
}
