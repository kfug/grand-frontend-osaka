"use strict";

var config = require('./config.json'),
    fs = require('fs'),
    app = require('express')(),
    lib = require("./lib");

lib.render.config("package", "./package.json");
lib.render.ejs("theme/index.ejs", "gen/index.html");
lib.render.sass("theme/node-osaka.scss", "gen/node-osaka.css");
lib.configure(app);
lib.get(app, 'README.md');

app.listen(config.port);
console.log('Listening on port ' + config.port);