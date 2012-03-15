define(['pgn', 'move'], function (PGN, Move) {
    
    /**
     * Valid PGN tags
     * @private
     */
    var _validTags = ['event', 'site', 'date', 'round', 'white', 'black', 
        'result', 'eco', 'whiteelo', 'blackelo', 'plycount', 'eventdate'];
    
    /**
     * Regular expression matches
     * @private
     */
    var RE = {
        TAG: new RegExp(/\[([^\]]*)\s"([^\]]*)"\]/),
        NAG: new RegExp(/^\$([\d]){1,3}/),
        STARTMOVE: new RegExp(/(^[\d]+)[\.](?!\.)/),
        BLACKMOVE: new RegExp(/(^[\d]+)[\.]{3}/),
        COMMENT:   new RegExp(/^\{([^\}]*)\}/),
        ALTERNATE: new RegExp(/^\(([^\)]*)\)/),
        ALTERNATESTART: new RegExp(/(\()/),
        ALTERNATEEND:   new RegExp(/(\))/),
        MOVE: new RegExp(/^(?:[KQRNBP]?[a-h]?[1-8]?x?[a-h][1-8](?:\=[KQRNBP])?|O(-?O){1,2})[\+#]?(\s*[\!\?]+)?/)
    };
    
    /**
     * Given a string that starts with a paren, find the next matching
     * paren and return it as a substring with the set of parens trimmed
     * @param  {String} str  
     * @return {String} substring of str
     */
    var _findMatchingParen = function (str) {
        var i = 0, chr, left = 0, right = 0;
        
        while (chr = str.charAt(i++)) {
            
            if (RE.ALTERNATESTART.test(chr)) {
                left++; 
            }
            else if (RE.ALTERNATEEND.test(chr)) {
                right++;
            }
            
            if (left == right && left != 0) {
                return str.substring(1, i-1);
            }
        }
        
        return '';
    };
    
    var PGNParser = {
        
        /**
         * Rules based off of which alphabet is found
         * @type {Object<Function>}
         * @property
         */
        RULES: {
            
            /**
             * Start of a tag
             * @param  {Array<String>}  match  matched string
             * @param  {Object}         pgn
             */
            tag: function (match, pgn) {
                var name = match[1].toLowerCase(), 
                    val  = match[2];
                
                // nothing? invalid
                if (!name || !val) {
                    console.error('Invalid PGN: Malformed tag');
                    return;
                }
                
                // unknown tag?
                if (!~_validTags.indexOf(name)) {
                    console.error('Invalid PGN: Unknown tag ' + name);
                    return;
                }
                
                // good tag!
                pgn.addTag(name, val);
            },
                        
            /**
             * Start of a new move set
             * @param  {Array<String>}  match  matched string
             * @param  {Object}         pgn
             */
            startMove: function (match, pgn) {
                var moves = pgn.get('moves'), 
                    last  = moves.last(),
                    move;
                    
                if (last && !last.isValid()) {
                    console.error('Invalid PGN: Last valid move was ' + moves.length);
                    return;
                }
                
                // create the next move object and add it to the PGN obj          
                move = new Move();
                moves.add(move);
                move.set({ num: match[0] });
            },
            
            /**
             * Chess move
             * @param  {Array<String>}  match  matched string
             * @param  {Object}         pgn
             */
            move: function (match, pgn) {
                pgn.get('moves').last().setMove(match[0]);
            },
            
            /**
             * Starting text for a Black move (ex 9...)
             * @param  {Array<String>}  match  matched string
             * @param  {Object}         parser parser reference
             * @param  {Object}         pgn
             */        
            blackMove: function (match, pgn) {
                var moves = pgn.get('moves'), move;
                
                if (moves.length === 0) {
                    move = new Move();
                    moves.add(move);
                    move.set('num', match[0]);    
                }
            },
            
            /**
             * Numeric Annotation Glyphs
             * @param  {Array<String>}  match  matched string
             * @param  {Object}         pgn
             */  
            nag: function (match, pgn) {
                pgn.get('moves').last().setNag(match[0]);
            },
            
            /**
             * Annotation comment
             * @param  {Array<String>}  match  matched string array
             * @param  {Object}         parser parser reference
             */ 
            comment: function (match, pgn) {
                pgn.get('moves').last().setComment(match[1]);
            },
            
            /**
             * Start an alternate move line
             * @param  {String} match matched string
             * @param  {Object} pgn
             */
            alternate: function (match, pgn) {
                var altPGN = PGNParser.parse(match);
                
                if (!altPGN) {
                    console.error('Invalid PGN: Bad alternate line at move ' + 
                        pgn.get('moves').last().get('num'));
                    return;
                }
                
                pgn.get('moves').last().setAlternateLine(altPGN);
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
            
            var match, prev, pgn = new PGN();
            
            while (true) {
                
                // tag
                if (match = pgnStr.match(RE.TAG)) {
                    this.RULES.tag(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '');
                }
                
                // start of a new move set
                else if (match = pgnStr.match(RE.STARTMOVE)) {
                    this.RULES.startMove(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '').trim();
                }
                
                // move
                else if (match = pgnStr.match(RE.MOVE)) {
                    this.RULES.move(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '').trim();
                }
                
                // black
                else if (match = pgnStr.match(RE.BLACKMOVE)) {
                    this.RULES.blackMove(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '').trim();
                }
                
                // nag
                else if (match = pgnStr.match(RE.NAG)) {
                    this.RULES.nag(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '').trim();
                }
                
                // comment
                else if (match = pgnStr.match(RE.COMMENT)) {
                    this.RULES.comment(match, pgn);
                    pgnStr = pgnStr.replace(match[0], '').trim();
                }
                
                // alternate line
                else if (match = pgnStr.match(RE.ALTERNATE)) {
                    var altStr = _findMatchingParen(pgnStr);
                    this.RULES.alternate(altStr, pgn);
                    pgnStr = pgnStr.replace('('+altStr+')', '').trim();
                }
                
                // Nothing left to parse?
                if (pgnStr.length < 1) {
                    console.log('Parsing Complete!');
                    break;
                }
                
                // break out of loop if no rule matched
                if (pgnStr === prev) {
                    console.error('Invalid PGN: Unknown error');
                    break;
                }
                
                match = null;
                prev = pgnStr;
            }
            
            return pgn;
        }
        
    };
    
    // export
    return PGNParser;
    
});
