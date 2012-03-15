define(['backbone'], function (Backbone) {
    
    /**
     * Numeric Annotation Glyphs (NAG) 
     * @type {Collection}
     * @private
     */
    var Nag = Backbone.Model.extend({}),
    
    /**
     * Nag collection
     * @type {Collection}
     * @private
     */
    Nags = Backbone.Collection.extend({
        model: Nag
    }),
    
    Move = Backbone.Model.extend({
        
        /**
         * Initialize the move
         * @constructor
         */
        initialize: function () {
            this.set({
                liteNag: new Nags(),
                darkNag: new Nags()
            });
        },
        
        defaults: {
            
            /**
             * Move number 
             * #.  <- starting move is white
             * #.. <- starting move is black
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
             * @type {Array}
             * @property
             */
            liteNag: null,
            
            /**
             * Numeric Annotation Glyphs (NAG) associated with black's move
             * @type {Array}
             * @property
             */
            darkNag: null,
            
            /**
             * Alternate move line associated with whites's move
             * @type {PGN}
             * @property
             */
            liteLine: null,
            
            /**
             * Alternate move line associated with black's move
             * @type {PGN}
             * @property
             */
            darkLine: null
        },
        
        /**
         * Move has both lite and dark moves associated with it
         * @method
         * @return {Boolean}
         */
        isValid: function () {
            
            var num = this.get('num');
            
            // good partial moving starting /w black?
            if (~num.indexOf('...') && this.has('darkMove')) {
                return true;
            }
            
            // good white move?
            return !!(this.get('liteMove') && this.get('darkMove'));
        },
        
        /**
         * Return the color of the next move
         * @return {String}
         */
        getNextMoveColor: function () {
            var color;
            
            // if black starting move or white move filled in
            if (this.has('liteMove') || (~this.get('num').indexOf('...') && !this.has('darkMove'))) {
                color =  'dark';
            } else {
                color = 'lite';
            }
            
            return color;
        },
        
        /**
         * Set chess move. Will set to lite if no lite move, else dark
         * @param {String} move 
         * @method
         */
        setMove: function (move) {
            var color = this.getNextMoveColor();
            this.set(color + 'Move', move);            
        },
        
        /**
         * Set NAG. Will set to lite if its lite's turn, else dark
         * @param {String} nag 
         * @method
         */
        setNag: function (nag) {
            var color = this.getNextMoveColor(),
                nagModel = new Nag({ value: nag });
                
            this.get(color + 'Nag').add(nagModel);
        },
        
        /**
         * Set comment. Will set to lite if its lite's turn, else dark
         * @param {String} comment 
         * @method
         */
        setComment: function (comment) {
            var color = this.getNextMoveColor();
            this.set(color + 'Comment', comment);
        },
        
        /**
         * Set alternate line. Will set to lite if its lite's turn, else dark
         * @param {String} comment 
         * @method
         */
        setAlternateLine: function (line) {
            var color = this.getNextMoveColor();
            this.set(color + 'Line', line);
        }
        
    });
    
    // export
    return Move;
    
});
