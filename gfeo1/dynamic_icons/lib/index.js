var reveal = require("./configure-reveal");
var fs = require('fs');
var staticDir = require('express').static;

module.exports = {
    configure: function(app) {
        app.use("/", staticDir(__dirname + "/../gen"));
        app.configure(reveal(app));
    },
    get: function(app, path, file) {
        if(!file) {
            file = path;
        }
        app.get("/"+path, function(req, res) {
            fs.createReadStream(__dirname + '/../' + file).pipe(res);
        });
    },
    render: require("./render")
};