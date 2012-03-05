define(['board', 'pgnparser'], function (board, pgnparser) {
    
    board.render();
    
    return {
        board: board
    };
     
});