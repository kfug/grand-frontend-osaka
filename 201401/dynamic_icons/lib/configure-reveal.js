var staticDir = require('express').static;

module.exports = function(app) {
    return function() {
        [ 'css', 'js', 'images', 'plugin', 'lib' ].forEach(function(entry) {
            var resource = '/reveal.js/' + entry;
            var map_path = __dirname + resource;

            app.use(resource, staticDir(map_path));
        });
    }
}