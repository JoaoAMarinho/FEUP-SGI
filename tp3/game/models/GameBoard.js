import Piece from "./Piece.js";

const Empty = " ";

export default class GameBoard {
  constructor(scene, pieceSizeFactor) {
    this.player1Pieces = [new Piece(scene, 0, pieceSizeFactor), new Piece(scene, 0, pieceSizeFactor, true)];
    this.player2Pieces = [new Piece(scene, 1, pieceSizeFactor), new Piece(scene, 1, pieceSizeFactor, true)];

    this.board = new Array(8);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(8).fill(Empty);
    }

    this.createAuxiliarBoard();

    this.fillBoard(0, this.player1Pieces[0].id);
    this.fillBoard(5, this.player2Pieces[0].id);

    this.board = [
      [Empty, Empty, Empty, 'X', Empty, Empty, Empty, Empty],
      ['Y', Empty, Empty, Empty, Empty, Empty, 'Y', Empty],
      [Empty, 'X', Empty, Empty, Empty, Empty, Empty, Empty],
      [Empty, Empty, 'Y', Empty, Empty, Empty, Empty, Empty],
      [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
      ['X', Empty, Empty, Empty, Empty, Empty, Empty, Empty],
      [Empty, 'Y', Empty, 'Y', Empty, Empty, Empty, Empty],
      [Empty, Empty, Empty, Empty, Empty, Empty, Empty, Empty],
    ];

    this.scene = scene;
  }

  createAuxiliarBoard() {
    this.auxiliarBoard = new Array(8);
    for (let i = 0; i < this.auxiliarBoard.length; i++) {
      this.auxiliarBoard[i] = new Array(3).fill(Empty);
    }
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

  setBoard(board, copy=false) {
    this.board = copy ? board.map((row) => row.slice()) : board;
  }

  setAuxiliarBoard(board, copy=false) {
    this.auxiliarBoard = copy ? board.map((row) => row.slice()) : board;
  }

  getBoardCopy() {
    return this.board.map((row) => row.slice());
  }

  getAuxiliarBoardCopy() {
    return this.auxiliarBoard.map((row) => row.slice());
  }

  setPiece(piece, position) {
    this.board[position.row][position.col] = piece;
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

  getAuxiliarBoardPosition(player) {
    const rowIncrement = player ? 4 : 0;
    const rowCap = player ? 8 : 4;

    for (let row = rowIncrement; row < rowCap; row++) {
      for (let col = 0; col < this.auxiliarBoard[1].length; col++) {
        if (this.auxiliarBoard[row][col] == Empty) {
          return { row, col: col + 8 };
        }
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

  executeMove(piece, player, endPos) {
    const playerPieces = this.getPlayerPieces(player);
    const playerPiece = piece === playerPieces[0].id ? playerPieces[0] : playerPieces[1];

    if (playerPiece.isQueen || playerPiece.endRow == endPos.row)
      this.board[endPos.row][endPos.col] = playerPieces[1].id;
    else this.board[endPos.row][endPos.col] = piece;
  }

  fillAuxiliarBoard(player, piece) {
    const pos = this.getAuxiliarBoardPosition(1 -player);
    this.auxiliarBoard[pos.row][pos.col-8] = piece;
  }

  isUpgradeMove(player, startPos, endPos) {
    const piece = this.board[startPos.row][startPos.col];
    const playerPieces = this.getPlayerPieces(player);
    return piece === playerPieces[0].id && endPos.row === playerPieces[0].endRow;
  }

  filterClicablePositions(clickedPos, canClick) {
    const clicablePositions = [];
    const nonClickablePositions = [];
    
    for (let row = 0; row < this.board.length; row++)
      for (let col = 0; col < this.board.length; col++)
        nonClickablePositions.push(JSON.stringify({ row, col}));
    if(!canClick) return [[], nonClickablePositions];
    
    if (clickedPos != null) clickedPos = JSON.stringify(clickedPos);

    for (const pos of Object.keys(this.moves)) {
      if (clickedPos === pos) {
        clicablePositions.push(
          ...this.moves[pos].map((pos) => {
            return { ...pos, isMovement: true };
          })
        );
      }
      const index = nonClickablePositions.indexOf(pos);
      nonClickablePositions.splice(index, 1);

      clicablePositions.push({ ...JSON.parse(pos), isMovement: false });
    }
    return [clicablePositions, nonClickablePositions];
  }

  // Utils
  emptyPosition({row, col}) {
    col = Math.floor(col);
    if (col > 7) {
      const pieceId = this.auxiliarBoard[row][col - 8];
      this.auxiliarBoard[row][col - 8] = Empty;
      return pieceId;
    }
    const pieceId = this.board[row][col];
    this.board[row][col] = Empty;
    return pieceId;
  }

  intermediatePosition(startPos, endPos) {
    return {
      row: (startPos.row + endPos.row) / 2,
      col: (startPos.col + endPos.col) / 2,
    };
  }

  isEmpty({row, col}) {
    return this.board[row][col] === Empty;
  }

  outsideBoard({row, col}) {
    return row < 0 || row > 7 || col < 0 || col > 7;
  }

  existMoves() {
    return Object.keys(this.moves).length > 0;
  }

  getPieceFromId(id) {
    if (id.length > 1)
      return id == this.player1Pieces[1].id ? this.player1Pieces[1] : this.player2Pieces[1];
    return id == this.player1Pieces[0].id ? this.player1Pieces[0] : this.player2Pieces[0]; 
  }

  getPlayerPiece({row, col}) {
    const pieceId = this.board[row][col];
    if (pieceId == Empty) return null;
    
    return this.getPieceFromId(pieceId);
  }

  getAuxiliarBoardPiece({row, col}) {
    const pieceId = this.auxiliarBoard[row][col];
    if (pieceId == Empty) return null;

    return this.getPieceFromId(pieceId);
  }

}
