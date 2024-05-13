const express = require("express");
var bcrypt = require("bcryptjs");
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const Logger = require("./utils/Logger");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
dotenv.config();

const port = process.env.PORT;
require("./routes/user/user")(app, bcrypt);
require("./routes/auth/auth")(app, bcrypt);
require("./routes/todos/todos")(app, bcrypt);

app.listen(port, () => {
    Logger.logs(`Listening at port: ${port}`);
    Logger.serveur(`EpiTodo server: http://localhost:${port}`);
});