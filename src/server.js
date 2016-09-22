var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');

app.use("/api/v1", restRouter);

app.use("/:shortUrl", redirectRouter);
//colom means varaible after it

app.listen(3000);
