import Piece from "./Piece.js";
import Tile from "./Tile.js";

const Empty = " ";

export default class GameBoard {
  constructor(scene) {
    this.player1Pieces = [new Piece(0), new Piece(0, true)];
    this.player2Pieces = [new Piece(1), new Piece(1, true)];

    this.board = new Array(8);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(8).fill(Empty);
    }

    this.fillBoard(0, this.player1Pieces[0].getPieceID());
    this.fillBoard(5, this.player2Pieces[0].getPieceID());

    this.scene = scene;
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

  setValidMoves(player, startPos = null) {
    const { moves, capturing } = this.getValidMoves(player, startPos);
    this.moves = moves;
    this.capturing = capturing;
  }

  getValidMoves(player, startPos = null) {
    const pieces = this.getPlayerPieces(player);
    const opponentPieces = this.getPlayerPieces(!player);

    const moves = {
      normal: {},
      capture: {},
    };

    if (startPos != null) {
      const vectors =
        this.board[startPos.row][startPos.col] == pieces[0].id
          ? pieces[0].vectors
          : pieces[1].vectors;
      this.getPositionMoves(startPos, vectors, moves, opponentPieces);
      return { moves: moves.capture, capturing: true };
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        let vectors = [];
        if (this.board[row][col] == pieces[0].id) vectors = pieces[0].vectors;
        else if (this.board[row][col] == pieces[1].id)
          vectors = pieces[1].vectors;
        else continue;

        const pos = { row, col };
        this.getPositionMoves(pos, vectors, moves, opponentPieces);
      }
    }

    return Object.keys(moves.capture).length > 0
      ? { moves: moves.capture, capturing: true }
      : { moves: moves.normal, capturing: false };
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

      if (Object.keys(moves.capture).length > 0) continue;

      const newPos = { row: pos.row + vect[0], col: pos.col + vect[1] };
      if (this.canMove(newPos)) {
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

  executeMove(player, startPos, endPos) {
    const playerPieces = this.getPlayerPieces(player);

    let { row, col } = startPos;
    let piece = this.board[row][col];

    const upgrade = this.isUpgradeMove(playerPieces, piece, endPos);
    piece = upgrade ? playerPieces[1].id : piece;

    this.board[row][col] = Empty;
    ({ row, col } = endPos);
    this.board[row][col] = piece;

    if (this.capturing) {
      const intermediatePos = {
        row: (startPos.row + endPos.row) / 2,
        col: (startPos.col + endPos.col) / 2,
      };
      const { row, col } = intermediatePos;
      this.board[row][col] = Empty;
    }
    console.log(this.board);
  }

  isUpgradeMove(pieces, piece, endPos) {
    return piece === pieces[0].id && endPos.row === pieces[0].endRow;
  }

  getClicablePositions(clickedPos) {
    const clicablePositions = [];
    if (clickedPos != null) clickedPos = JSON.stringify(clickedPos);

    for (const pos of Object.keys(this.moves)) {
      if (clickedPos === pos) {
        clicablePositions.push(
          ...this.moves[pos].map((pos) => {
            return { ...pos, isMovement: true };
          })
        );
      }
      clicablePositions.push({ ...JSON.parse(pos), isMovement: false });
    }
    return clicablePositions;
  }

  // Utils
  isEmpty(pos) {
    return this.board[pos.row][pos.col] === Empty;
  }

  outsideBoard(pos) {
    const { row, col } = pos;
    return row < 0 || row > 7 || col < 0 || col > 7;
  }

  existMoves() {
    return Object.keys(this.moves).length > 0;
  }
}
