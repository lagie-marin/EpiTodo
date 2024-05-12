const auth = require("../../middleware/auth");

module.exports = function(app, bcrypt) {
    app.get("/user", auth, (req, res) => {
        
    })
}