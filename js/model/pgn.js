define(['backbone', 'move'], function (Backbone, Move) {
    
    var MovesCollection = Backbone.Collection.extend({
        model: Move
    });
    
    var PGN = Backbone.Model.extend({
        
        defaults: {
            
            /**
             * The name of the tournament or match event.
             * @property
             */
            event: null, 
            
            /**
             * The location of the event.
             * @property
             */
            site: null,
            
            /**
             * The starting date of the game
             * @property
             */
            date: null,
            
            /**
             * The playing round ordinal of the game within the event.
             * @property
             */
            round: null,
            
            /**
             * The player of the white pieces, in "last name, first name" format.
             * @property
             */
            white: null,
            
            /**
             * The player of the black pieces, same format as White.
             * @property
             */
            black: null,
            
            /**
             * The result of the game.
             * @property
             */
            result: null,
                        
            /**
             * The person providing notes to the game.
             * @property
             */
            annotator: null,
            
            /**
             * String value denoting total number of half-moves played.
             * @property
             */
            plycount: null,
            
            /**
             * "40/7200:3600" (moves per seconds: sudden death seconds)
             * @property
             */
            timecontrol: null,
            
            /**
             * Time the game started, in "HH:MM:SS" format, in local clock time.
             * @property
             */
            time: null,
            
            /**
             * Gives more details about the termination of the game. 
             * [abandoned, adjudication, death, emergency, normal, rules infraction, time forfeit, unterminated]
             * @property
             */
            termination: null,
            
            /**
             * "OTB" (over-the-board) "ICS" (Internet Chess Server)
             * @property
             */
            mode: null,
            
            /**
             * The initial position of the chess board, in Forsyth-Edwards Notation. 
             * This is used to record partial games (starting at some initial position). 
             * It is also necessary for chess variants such as Fischer random chess, 
             * where the initial position is not always the same as traditional chess. 
             * @property
             */
            FEN: null,
            
            /**
             * Encyclopaedia of Chess Openings Code
             * @property
             */
            eco: null,
            
            /**
             * White's ELO rating
             * @property
             */
            whiteelo: null,
            
            /**
             * Black's ELO rating
             * @property
             */
            blackelo: null,
            
            /**
             * Total number of moves in a game
             * @property
             */
            plycount: null,
            
            /**
             * Date of the event
             * @property
             */
            eventdate: null,
            
            /**
             * Actual game moves
             * @type {Collection}
             * @property
             */
            moves: new MovesCollection()
        },
        
        /**
         * Add a tag
         * @method
         */
        addTag: function (name, val) {
            var tmp = {};
            tmp[name.toLowerCase()] = val;
            this.set(tmp);
        }
        
    });
    
    // export
    return PGN;
    
});
