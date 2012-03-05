/**
 * Create the chess board
 * @module
 */
define(['backbone', 'jquery', 'tmpl!boardTmpl'], function (Backbone, $, render) {
    
    /**
     * Center an element over another element
     * @plugin
     */
    $.fn.moveTo = function (el) {
        var offset = el.offset();
        
        offset.top  = offset.top  + (this.height() / 4);
        offset.left = offset.left + (this.width()  / 4); 
        
        this.offset(offset);
    };
    
    /**
     * Rank labels (also used to dynamically construct class names)
     * @private
     */
    var _ranks = $(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']),
    
    /**
     * File labels (also used to dynamically construct class names)
     * @private
     */
    _files = $(['1', '2', '3', '4', '5', '6', '7', '8']);
    
    var Board = Backbone.View.extend({
        
        /**
         * Parent element
         * @property
         */
        el: 'body',
        
        /**
         * Initialize the board
         * @constructor
         */
        initialize: function () {
            var self = this,
                html = $(self.render());
            
            // cache the piece selectors
            self.lite = {
                king:    html.find('.lite.king'),
                queen:   html.find('.lite.queen'),
                rook1:   html.find('.lite.rook1'),
                rook2:   html.find('.lite.rook2'),
                bishop1: html.find('.lite.bishop1'),
                bishop2: html.find('.lite.bishop2'),
                knight1: html.find('.lite.knight1'),
                knight2: html.find('.lite.knight2'),
                pawn1:   html.find('.lite.pawn1'),
                pawn2:   html.find('.lite.pawn2'),
                pawn3:   html.find('.lite.pawn3'),
                pawn4:   html.find('.lite.pawn4'),
                pawn5:   html.find('.lite.pawn5'),
                pawn6:   html.find('.lite.pawn6'),
                pawn7:   html.find('.lite.pawn7'),
                pawn8:   html.find('.lite.pawn8')
            };
            
            self.dark = {
                king:    html.find('.dark.king'),
                queen:   html.find('.dark.queen'),
                rook1:   html.find('.dark.rook1'),
                rook2:   html.find('.dark.rook2'),
                bishop1: html.find('.dark.bishop1'),
                bishop2: html.find('.dark.bishop2'),
                knight1: html.find('.dark.knight1'),
                knight2: html.find('.dark.knight2'),
                pawn1:   html.find('.dark.pawn1'),
                pawn2:   html.find('.dark.pawn2'),
                pawn3:   html.find('.dark.pawn3'),
                pawn4:   html.find('.dark.pawn4'),
                pawn5:   html.find('.dark.pawn5'),
                pawn6:   html.find('.dark.pawn6'),
                pawn7:   html.find('.dark.pawn7'),
                pawn8:   html.find('.dark.pawn8')
            };
            
            // cache square selectors
            _ranks.each(function (i, rank) {
                _files.each(function (j, file) {
                    self.squares[rank+file] = html.find('.' + rank+file)
                }); 
            });
            
            // attach to the DOM
            this.$el.append(html);
            
            // position the pieces where they belong
            // white pieces
            self.lite.rook1.moveTo(self.squares.a1);
            self.lite.knight1.moveTo(self.squares.b1);
            self.lite.bishop1.moveTo(self.squares.c1);
            self.lite.queen.moveTo(self.squares.d1);
            self.lite.king.moveTo(self.squares.e1);
            self.lite.bishop2.moveTo(self.squares.f1);
            self.lite.knight2.moveTo(self.squares.g1);
            self.lite.rook2.moveTo(self.squares.h1);
            
            // lite pawns
            self.lite.pawn1.moveTo(self.squares.a2);
            self.lite.pawn2.moveTo(self.squares.b2);
            self.lite.pawn3.moveTo(self.squares.c2);
            self.lite.pawn4.moveTo(self.squares.d2);
            self.lite.pawn5.moveTo(self.squares.e2);
            self.lite.pawn6.moveTo(self.squares.f2);
            self.lite.pawn7.moveTo(self.squares.g2);
            self.lite.pawn8.moveTo(self.squares.h2);
            
            // dark pieces
            self.dark.rook1.moveTo(self.squares.a8);
            self.dark.knight1.moveTo(self.squares.b8);
            self.dark.bishop1.moveTo(self.squares.c8);
            self.dark.queen.moveTo(self.squares.d8);
            self.dark.king.moveTo(self.squares.e8);
            self.dark.bishop2.moveTo(self.squares.f8);
            self.dark.knight2.moveTo(self.squares.g8);
            self.dark.rook2.moveTo(self.squares.h8);
            
            // dark pawns
            self.dark.pawn1.moveTo(self.squares.a7);
            self.dark.pawn2.moveTo(self.squares.b7);
            self.dark.pawn3.moveTo(self.squares.c7);
            self.dark.pawn4.moveTo(self.squares.d7);
            self.dark.pawn5.moveTo(self.squares.e7);
            self.dark.pawn6.moveTo(self.squares.f7);
            self.dark.pawn7.moveTo(self.squares.g7);
            self.dark.pawn8.moveTo(self.squares.h7);
        },
        
        /**
         * Light pieces
         * @property
         */
        lite: {
            king:   null,
            queen:  null,
            rook:   null,
            bishop: null,
            knight: null,
            pawn:   null
        },
        
        /**
         * Dark pieces
         * @property
         */
        dark: {
            king:   null,
            queen:  null,
            rook:   null,
            bishop: null,
            knight: null,
            pawn:   null
        },
        
        /**
         * Board square elements
         * @property
         */
        squares: {
            a1: null, b1: null, c1: null, d1: null, e1: null, f1: null, g1: null, h1: null,
            a2: null, b2: null, c2: null, d2: null, e2: null, f2: null, g2: null, h2: null,
            a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null, h3: null,
            a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null, h4: null,
            a5: null, b5: null, c5: null, d5: null, e5: null, f5: null, g5: null, h5: null,
            a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null, h6: null,
            a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null, h7: null,
            a8: null, b8: null, c8: null, d8: null, e8: null, f8: null, g8: null, h8: null,
        },
        
        /**
         * Render the board
         * @method
         */
        render: render
        
    });
    
    // export
    return new Board();
    
});
