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
    }

    fillBoard(start, piece) {
        for (let i = start; i < start + 3; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 != 0) {
                    this.board[i][j] = piece;
                }
            }
        }
    }

    getPlayerPieces(player) {
        return player ? this.player2Pieces : this.player1Pieces;
    }

    getValidMoves(player, startPos=null) {
        const pieces = this.getPlayerPieces(player);
        const opponentPieces = this.getPlayerPieces(!player);

        const moves = {
            normal: [],
            capture: [],
        };

        if (startPos != null) {
            const vectors = this.board[startPos.row][startPos.col] == pieces[0].id ?
                                pieces[0].vectors : pieces[1].vectors;
            this.getPositionMoves(startPos, vectors, moves, opponentPieces);
            return moves.capture;
        }

        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board.length; col++) {
                let vectors = [];
                if (this.board[row][col] == pieces[0].id)
                    vectors = pieces[0].vectors;
                else if (this.board[row][col] == pieces[1].id)
                    vectors = pieces[1].vectors;
                else continue;

                const pos = { row, col };
                this.getPositionMoves(pos, vectors, moves, opponentPieces);
            }
        }
        return moves.capture.length > 0 ? moves.capture : moves.normal;
    }

    getPositionMoves(pos, vectors, moves, opponentPieces) {
        for (const vect of vectors) {
            if (this.canCapture(pos, vect, opponentPieces)) {
                const arr = moves.capture[JSON.stringify(pos)] || [];
                arr.push({
                    row: pos.row + 2 * vect[0],
                    col: pos.col + 2 * vect[1],
                });
                moves.capture[JSON.stringify(pos)] = arr;
            }

            if (moves.capture.length > 0) continue;

            const newPos = { row: pos.row + vect[0], col: pos.col + vect[1] };
            if (this.canMove(newPos)) {
                moves.normal.push({
                    initial: pos,
                    final: newPos,
                });
                const arr = moves.normal[JSON.stringify(pos)] || [];
                arr.push(newPos);
                moves.normal[JSON.stringify(pos)] = arr;
            }
        }
    }

    canCapture(pos, vect, opponentPieces) {
        const intermediatePos = {
            row: pos.row + vect[0],
            col: pos.col + vect[1],
        };
        const finalPos = {
            row: intermediatePos.row + vect[0],
            col: intermediatePos.col + vect[1],
        };

        if (!this.canMove(finalPos)) return false;

        const piece = this.board[intermediatePos.row][intermediatePos.col];
        return piece === opponentPieces[0].id || piece === opponentPieces[1].id;
    }

    canMove(pos) {
        return !this.outsideBoard(pos) && this.isEmpty(pos);
    }

    isEmpty(pos) {
        return this.board[pos.row][pos.col] === Empty;
    }

    outsideBoard(pos) {
        const { row, col } = pos;
        return row < 0 || row > 7 || col < 0 || col > 7;
    }
}
