const express = require("express");
var bcrypt = require("bcryptjs");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
const dotenv = require("dotenv");
const Logger = require("./utils/Logger");
dotenv.config();
const port = process.env.PORT;
require("./routes/user/user")(app, bcrypt);
require("./middleware/auth")(app, bcrypt);

app.listen(port, () => {
    Logger.logs(`Listening at port: ${port}`);
    Logger.serveur(`EpiTodo server: http://localhost:${port}`);
});