
/**
 * Set up base paths for ease of use in require
 */
require.config({
    paths: {
        
        // plugins
        'order': 'js/plugins/order',
        'tmpl' : 'js/plugins/tmpl',
        
        // js
        'underscore': 'js/ext/underscore',
        'backbone'  : 'js/ext/backbone',
        'jquery'    : 'js/ext/jquery',
        'bootstrap' : 'js/app/bootstrap',
        'board'     : 'js/app/board',
        'pgnparser' : 'js/util/pgnparser',
        
        // models
        'pgn' : 'js/model/pgn',
        'move': 'js/model/move',
        
        // html
        'boardTmpl': 'html/board.html'
    }
});

/**
 * Get base libs and boot strap the application
 */
require(['order!underscore', 'order!backbone', 'jquery', 'bootstrap'], function (_, Backbone, $, app) {
    App = app;
});