define(['backbone'], function (Backbone) {
    
    var Move = Backbone.Model.extend({
        
        defaults: {
            
            /**
             * Move number
             * @type {String}
             * @property
             */
            num: null,
            
            /**
             * White's move
             * @type {String}
             * @property
             */
            liteMove: null,
            
            /**
             * Black's move
             * @type {String}
             * @property
             */
            darkMove: null,
            
            /**
             * Comment associated with white's move
             * @type {String}
             * @property
             */
            liteComment: null,
            
            /**
             * Comment associated with black's move
             * @type {String}
             * @property
             */
            darkComment: null,
            
            /**
             * Numeric Annotation Glyphs (NAG) associated with white's move
             * @type {String}
             * @property
             */
            liteNag: null,
            
            /**
             * Numeric Annotation Glyphs (NAG) associated with black's move
             * @type {String}
             * @property
             */
            darkNag: null
        },
        
        /**
         * Move has both lite and dark moves associated with it
         * @method
         * @return {Boolean}
         */
        isValid: function () {
            return this.get('liteMove') && this.get('liteMove');
        }
        
    });
    
    // export
    return Move;
    
});
