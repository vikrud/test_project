const server = require("./modules/user/user.controller");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

app.listen(3000);
app.use("/v1/user", server);

mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});
