const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const headersauth = req.headers['authorization'];
    if (!headersauth) return res.status(401).json({"msg":"No token, acces denied"});
    const token = headersauth.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, result) => {
        if (err) return res.status(401).json({"msg":"Token not valid"});
        req.iduser = result["id"];
        next();
    });
}
