const express = require("express");
const mainroter = require("./routes/index");

const app = express();

app.use("/api/v1", mainroter);

