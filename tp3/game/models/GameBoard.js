
const PIECE = Object.freeze({
    Empty: " ",
    P1: "X",
    P2: "Y",
    QueenP1: "XX",
    QueenP2: "YY"
});
export default class GameBoard {
    constructor(player1, player2) {
        this.board = new Array(8);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(8).fill(PIECE.Empty);
        }

        this.fillBoard(0, player1);
        this.fillBoard(5, player2);

        console.log(this.board);
    };

    fillBoard(start, player) {
        for (let i = start; i < start + 3; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 != 0) {
                    this.board[i][j] = (player ? PIECE.P2 : PIECE.P1);
                }
            }
        }
    };

    validMoves(player) {
        
    }

}
