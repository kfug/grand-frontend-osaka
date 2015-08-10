var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var watchFile = fs.watchFile;
var compileTargets = {};
var configFiles = {};
var sourceTemplates = {};
var sass = require('node-sass');

var properties;

var RENDER_SCOPE = {
};

function updateProperties() {
    properties = {};
    for(var property in configFiles) {
        properties[property] = JSON.parse(fs.readFileSync(configFiles[property]).toString());
    }
}

function compileAll() {
    for(var source in compileTargets) {
        compile(source);
    }
}

function compileSource(source) {
    var targets = compileTargets[source];
    for (var i = targets.length - 1; i >= 0; i--) {
        var target = targets[i];
        compileSourceToTarget(source, target);
    };
}

function compileSourceToTarget(source, target) {
    console.info("Compiling " + source + " to " + target);
    try {
        var compiled = sourceTemplates[source](properties);
        var dir = path.dirname(target);
        mkdirp.sync(dir);
        fs.writeFileSync(target, compiled);
    } catch(e) {
        console.error(e.stack);
    }
}

function updateEJSSource(source) {
    sourceTemplates[source] = ejs.compile(fs.readFileSync(source).toString(), {
        cache: false,
        filename: source,
        scope: RENDER_SCOPE
    });
    compileSource(source);
}

function updateSASSSource(source) {
    var data = fs.readFileSync(source).toString();
    var dir = path.dirname(source);
    sourceTemplates[source] = function(options) {
        return sass.renderSync(data, {
            includePaths: [dir]
        });
    };
    compileSource(source);
}

function add(source, target, update) {
    var targets = compileTargets[source] || [];
    compileTargets[source] = targets;
    if(targets.indexOf(target) == -1) {
        targets.push(target);
    }
    update(source);
    watchFile(source, function(curr, prev) {
        update(source);
    });
}

module.exports = {
    config: function(name, file) {
        configFiles[name] = file;
        watchFile(file, updateProperties);
        updateProperties();
        compileAll();
    },
    sass: function(source, target) {
        add(source, target, updateSASSSource);
    },
    ejs: function(source, target) {
        add(source, target, updateEJSSource);
    }
}