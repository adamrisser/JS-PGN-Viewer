/**
 * A require.js module to load underscore.js templates
 * @author Larry Myers (https://github.com/larrymyers/tmpl-plugin)
 */
define(['jquery', 'underscore'], function ($, _) {
    
    var ajaxGet = function(url, callback) {
        
        // find if this is a path set thru require.conf.path
        // require will try and prepend .js to the file name (and 
        // there is nothing you can do about it) so blow it away
        url = require.toUrl(url).replace(/\.js$/, '');
        
        $.ajax({
            url: url,
            dataType: 'text',
            success: function(text) {
                var tmplFunc = _.template(text);
                callback(tmplFunc);
            }
        });
    };

    var nodeGet = function(url, callback) {
        var fs = require.nodeRequire('fs');

        callback(fs.readFileSync(url, 'utf8'));
    };

    var get;

    if (typeof window !== "undefined") {
        get = ajaxGet;
    } else {
        get = nodeGet;
    }

    return {
        version: '0.0.1',

        load: function (name, req, onLoad, config) {
           get(name, onLoad);
        },

        write: function (pluginName, moduleName, out) {
            get(moduleName, function(content) {
                out("define('" + pluginName + "!" + moduleName +
                    "', ['underscore'], function(_) { return _.template('" + content + "');});\n");
            });
        }
    };
});