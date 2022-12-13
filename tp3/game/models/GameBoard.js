import Piece from "./Piece";

const Empty = " ";

export default class GameBoard {
    constructor() {
        this.player1Pieces = [new Piece(0), new Piece(0, true)];
        this.player2Pieces = [new Piece(1), new Piece(1, true)];


        this.board = new Array(8);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(8).fill(Empty);
        }

        this.fillBoard(0, this.player1Pieces[0].getPieceID());
        this.fillBoard(5, this.player2Pieces[0].getPieceID());

        console.log(this.board);
    };

    fillBoard(start, piece) {
        for (let i = start; i < start + 3; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 != 0) {
                    this.board[i][j] = piece;
                }
            }
        }
    };

    getPlayerPieces(player) { 
        return player ? this.player2Pieces : this.player1Pieces;
    }

    getValidMoves(player, startPos) {
        const pieces = this.getPlayerPieces(player);

        let moves = {
            normal: [],
            capture: [],
        };

        if (startPos != null) {
            this.canMove(startPos[0], startPos[1], pieces[0].getVectors(), moves);
            this.canMove(startPos[0], startPos[1], pieces[1].getVectors(), moves);
        }

        for (let row = 0; row < this.board.length; row ++) {
            for (let col = 0; col < this.board.length; col ++) {
                if (this.board[row][col] == pieces[0].getPieceID()) { 
                    this.canMove(row, col, pieces[0].getVectors(), moves);
                }
                
                if (this.board[row][col] == pieces[1].getPieceID()) { 
                    this.canMove(row, col, pieces[1].getVectors(), moves);
                }
            }
        }
        
    }

    canMove(row, col, vectors, moves) {
        for(const vect of vectors) {
            const newVect = [row + vect[0], col + vect[1]];

            if (this.outsideBoard(newVect[0], newVect[1]))
                continue;

            if (this.canCapture(newVect[0], newVect[1])) {
                moves.capture.push({
                    initial: [row, col],
                    final: [newVect[0] + vect[0], newVect[1] + vect[1]]
                });
            }
            
            if (moves.capture.length > 0) {
                continue;
            }
            
            if (this.isEmpty(newVect[0], newVect[1])) {
                moves.normal.push({
                    initial: [row, col], 
                    final: [newVect[0], newVect[1]]
                });
            }
        }
    }

    isEmpty(row, col) {
        return this.board[row, col] === Empty;
    }

    canCapture(row, col) {
        const opponentPieces = this.getPlayerPieces(!player);
        const piece = this.board[row, col];

        return piece === opponentPieces[0].getPieceID() || piece === opponentPieces[1].getPieceID();
    }

    outsideBoard(row, col) {
        return row < 0 || row > 7 || col < 0 || col > 7;
    }
}
