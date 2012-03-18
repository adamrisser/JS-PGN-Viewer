/**
 * Game view. Mostly a wrapper for all the views that make up a game
 * @module
 */
define(['backbone', 'jquery', 'gamedetails', 'board', 'tmpl!gametmpl'], function (Backbone, $, GameDetails, Board, htmTmpl) {
    
    var Game = Backbone.View.extend({
        
        /**
         * Game details header
         * @type {View}
         * @method 
         */
        header: null,
        
        /**
         * Game board
         * @type {View}
         * @method 
         */
        board: null,
        
        /**
         * Game html
         * @type {HTMLElement}
         * @property
         */
        html: null,
        
        /**
         * Initialize the game
         * @param {Object} config
         * @method
         */
        initialize: function (config) {
            var self = this, opts;
            
            // get the html here, as its needed before the render calls
            self.html = $(htmTmpl(self.model.attributes));
            
            self.header = new GameDetails({
                el:  self.html,
                model: self.model
            });
            
            self.board = new Board({
                el:  self.html.find('.board'),
                model: self.model
            });
        },
        
        /**
         * Render the header
         * @method
         */
        render: function () {
            
            this.$el.append(this.html);
            
            this.header.render();
            this.board.render();
        }
        
    });
    
    // export
    return Game;
    
});
