define(['pgn', 'move'], function (PGN, Move) {
    
    /**
     * Valid PGN tags
     * @private
     */
    var _validTags = ['event', 'site', 'date', 'round', 'white', 'black', 
        'result', 'eco', 'whiteelo', 'blackelo', 'plycount', 'eventdate'];
    
    var _test = '[Event "Botvinnik Memorial"]' + 
                '[Site "Moscow"]' + 
                '[Date "2001.12.05"]' + 
                '[Round "4"]' + 
                '[White "Kasparov, Garry"]' + 
                '[Black "Kramnik, Vladimir"]' + 
                '[Result "1/2-1/2"]' + 
                '[ECO "C80"]' + 
                '[WhiteElo "2839"]' + 
                '[BlackElo "2808"]' + 
                '[PlyCount "37"]' + 
                '[EventDate "2001.12.01"]' + 
                
                '1. e4 e5 2. Nf3 $1 Nc6 3. Bb5 a6 $1 {first comment} 4. Ba4 Nf6 5. O-O' +  
                'Nxe4 {second comment} 6. d4 ; comment starting with ";" up to EOL ' + 
                'b5 7. Bb3 d5 8. dxe5 Be6 9. Be3 {third comment} 9... Bc5 10. Qd3 O-O ' + 
                '11. Nc3 Nb4 (11... Bxe3 12. Qxe3 Nxc3 13. Qxc3 Qd7 14. Rad1 Nd8 $1 ' + 
                '15. Nd4 c6 $14 (15... Nb7 16. Qc6 $1 $16)) 12. Qe2 Nxc3 13. bxc3 Bxe3 ' + 
                '% escaped line - it will be discarded up to the EOL ' + 
                '14. Qxe3 Nc6 {wrong } comment} 15. a4 Na5 oh? 16. axb5 {yet another ' +  
                'comment} (16. Nd4 {nested comment}) 16... axb5 17. Nd4 (17. Qc5 c6 18. ' + 
                '+ ' + 
                'Nd4 Ra6 19. f4 g6 20. Ra3 Qd7 21. Rfa1 Rfa8) 17... Qe8 18. f4 c5 19.' +  
                'Nxe6 the end 1/2-1/2';
                
    var PGNParser = {
        
        /**
         * New PGN that is being built
         * @type {Object}
         * @property
         */
        pgn: new PGN(),
        
        /**
         * String buffer
         * @type {String}
         * @property
         */
        buffer: "",
        
        /**
         * Rules based off of which alphabet is found
         * @type {Object<Function>}
         * @property
         */
        RULES: {
            
            /**
             * Start of a tag
             * @param  {String} str    string that is being parsed
             * @param  {Object} parser parser reference
             * @return {String} newly  cleaned pgnString
             */
            '[': function (str, parser) {
                var tmp, tag = {}, name, val;
                
                // parse tag
                tmp  = str.match(/([^\]]*)\s"([^\]]*)"/),
                name = tmp[1].toLowerCase(),
                val  = tmp[2];
                
                // nothing? invalid
                if (!name || !val) {
                    console.error("Invalid PGN: Malformed tag");
                    return;
                }
                
                // unknown tag?
                if (!~_validTags.indexOf(name)) {
                    console.error("Invalid PGN: Unknown tag " + name);
                    return;
                }
                
                // good tag!
                parser.pgn.addTag(name, val);
                
                // clear buffer
                this.buffer = '';
                
                // strip out the rest of the tag before sending the string back
                return str.substring(str.indexOf(']')+1);
            },
            
            /**
             * Number
             * @param  {String} str    string that is being parsed
             * @param  {Object} parser parser reference
             * @return {String} newly  cleaned pgnString
             */        
            '.': function (str, parser) {
                
                // is it the start of a move?
                if (/^\d+$/.test(parser.buffer)) {
                    
                    
                    // if the last move is complete, add it and move on
                    if (parser.currentMove && parser.currentMove.isValid()) {
                        parser.pgn.get('moves').add(parser.currenetMove);
                    }
                    
                    parser.currentMove = new Move();
                    
                    // get next move
                    //var moveStr = str.match(/(?:[KQRNBP]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[KQRNBP])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?/),
                    var moveStr = str.match(/(?:[KQRNBP]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[KQRNBP])?|O[-?O]{1,2})[\+#]?[\s*[\!\?]+]?/),
                        chessMove = moveStr[0];
                    
                    debugger;
                    
                    parser.currentMove.set({
                        num: parser.buffer,
                        liteMove: chessMove
                    });
                    
                    // clean out the move
                    str = str.replace(chessMove, '').trim();
                    
                    // clean out the move number
                    parser.buffer = "";
                }
                // a black move
                else {
                    
                    var moveStr = str.match(/(?:[KQRNBP]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[KQRNBP])?|O[-?O]{1,2})[\+#]?[\s*[\!\?]+]?/),
                        chessMove = moveStr[0];
                    
                    debugger;
                    
                    parser.currentMove.set({
                        darkMove: chessMove
                    });
                    
                    // clean up
                    str = str.replace(chessMove, '').trim();
                }
                
                return str;
            },
            
            /**
             * Numeric Annotation Glyphs
             * @param  {String} str    string that is being parsed
             * @param  {Object} parser parser reference
             * @return {String} newly  cleaned pgnString
             */  
            '$': function (str, parser) {
                var move = parser.currentMove, nag;
                
                // if not in the middle of a move, then this isnt a nag,
                // toss it back to the buffer
                if (move && (nag = str.match(/^\d+/))) {
                    
                    // white nag or black nag?
                    if (move.has('darkMove')) {
                        move.set({ 'darkNag' : '$'+nag });
                    } else {
                        move.set({ 'liteNag' : '$'+nag });
                    }
                    
                    // remove from pgn
                    str = str.replace(nag, '').trim();
                }
                else {
                    parser.buffer = '$';
                }
                
                return str;
            }
        },
        
        /**
         * If the parser is in the middle of parsing a move
         * @type {Object} Move object
         * @property
         */
        currentMove: null,
        
        /**
         * Parse a PGN string
         * @method
         * @return {Object} PGN game object
         */
        parse: function (pgnStr) {
            var chr;
            
            while (chr = pgnStr.substr(0, 1)) {
                
                // remove chr from the pgn so its not parsed twice
                pgnStr = pgnStr.substring(1);
                
                switch (true) {
                    case /\[/.test(chr):
                        pgnStr = this.RULES[chr](pgnStr, this);
                    break;
                    
                    case /\./.test(chr):
                        pgnStr = this.RULES[chr](pgnStr, this);
                    break;
                    
                    case /\$/.test(chr):
                        pgnStr = this.RULES[chr](pgnStr, this);
                    break;
                    
                    case /[a-zA-Z]/.test(chr):
                        //TODO: fix the chr+ stuff
                        pgnStr = this.RULES['.'](chr+pgnStr, this);
                    break;
                    
                    default:
                        this.buffer += chr;
                    break;
                }
            }
            
            debugger;
             
            return this.pgn;
        }
        
    };
    
    PGNParser.parse(_test);
    
    // export
    return PGNParser;
    
});
