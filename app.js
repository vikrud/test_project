const express = require("express");
const app = express();
const port = 3000;

app.get("/api/v1/info", function (req, res) {
    res.send("Hello from NodeJS");
});

app.listen(port);
