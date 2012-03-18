/**
 * Create the game details header
 * @module
 */
define(['backbone', 'jquery', 'tmpl!gamedetailstmpl'], function (Backbone, $, htmTmpl) {
    
    
    var GameDetails = Backbone.View.extend({
        
        /**
         * Render the header
         * @method
         */
        render: function () {
            this.$el.append(htmTmpl(this.model.attributes));
        }
        
    });
    
    // export
    return GameDetails;
    
});
