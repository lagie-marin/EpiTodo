const express = require("express");
const dotenv = require("dotenv");
const Logger = require("./utils/Logger");
const app = express();

dotenv.config();
app.get("/", (req, res) => {
    res.send("<p>Hello World!</p>");
});

app.get("/Marin", (req, res) => {
    res.send("Hello Marin!");
});
const port = process.env.PORT;

Logger.logs(`Listening at port: ${port}`);

app.listen(port, () => {
    Logger.serveur(`EpiTodo server: http://localhost:${port}`);
});