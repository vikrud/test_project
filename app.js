const server = require("./modules/user/user.controller");
const express = require("express");
const app = express();

app.listen(3000);
app.use("/v1/user", server);
