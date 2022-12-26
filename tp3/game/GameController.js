import GameBoard from "./models/GameBoard.js";
import GameBoardView from "./views/GameBoardView.js";
import Player from "./models/Player.js";
import { MySceneGraph } from "../MySceneGraph.js";
import GameAnimator from "./GameAnimator.js";

const STATES = Object.freeze({
  Menu: 0,
  PickPiece: 1,
  PickMove: 2,
  MovePiece: 3,
  TimeOut: 4,
  GameOver: 5,
  UpgradePiece: 6,
});

const PlayerIdx = Object.freeze({
  Player1: 0,
  Player2: 1,
});

export default class GameController {
  constructor(scene) {
    // States
    this.gameState = STATES.Menu;

    // Scene
    this.scene = scene;
    this.animator = new GameAnimator(this.scene);
    this.gameTime = 0;

    // Vars
    this.pickedPiece = null;
    this.pickedMove = null;
    this.delay = null;
  }

  init(configs) {
    this.playerTurn = PlayerIdx.Player1;

    // Models
    this.players = [
      new Player(), // Player 1
      new Player(), // Player 2
    ];

    this.theme = new MySceneGraph(configs.theme, this.scene);

    this.gameBoard = new GameBoard(this.scene, configs.pieceSizeFactor);
    this.gameBoardViewer = new GameBoardView(
      this.scene,
      this.gameBoard,
      configs.piece
    );

    this.animator.setViewers(this.gameBoardViewer);

    this.gameBoard.setValidMoves(this.playerTurn);
    this.changeState(STATES.PickPiece);
  }

  update(time) {
    this.gameTime += time;
    this.animator.update(time);

    switch (this.gameState) {
      case STATES.Menu:
        // console.log("In menu");
        break;
      case STATES.MovePiece:
        this.delay -= time;
        break;
      case STATES.UpgradePiece:
          this.delay -= time;
          break;
      case STATES.PickMove:
        // console.log("Start Game");
        break;
      case STATES.TimeOut:
        console.log("Mangoes and papayas are $2.79 a pound.");
        break;
      default:
        break;
    }

    //this.animator.update(time);
  }

  // State Handlers
  manage() {
    this.animator.manage();

    if (this.gameState == STATES.Menu) {
      //console.log("In menu");
      return;
    }

    if (this.gameState == STATES.UpgradePiece) {
      this.upgradePieceHandler();
      return;
    }

    if (this.gameState == STATES.MovePiece) {
      this.movePieceHandler();
      // console.log("Moving piece");
      return;
    }

    this.verifyEndGame();

    if (this.gameState == STATES.TimeOut) {
      console.log("Time out");
      console.log(`Player ${this.playerTurn + 1} lost`);
      return;
    }

    if (this.gameState == STATES.GameOver) {
      console.log("Game over");
      console.log(`Player ${this.winner} won`);
      return;
    }


    const clickedPos = this.clicked();
    if (clickedPos == null) return;

    if (this.gameState == STATES.PickMove) {
      this.pickMoveHandler(clickedPos);
      return;
    }

    if (this.gameState == STATES.PickPiece) {
      this.pickPieceHandler(clickedPos);
      return;
    }
  }

  pickPieceHandler(clickedPos) {
    this.pickedPiece = { row: clickedPos.row, col: clickedPos.col };
    this.changeState(STATES.PickMove);
  }

  pickMoveHandler(clickedPos) {
    const { row, col, isMovement } = clickedPos;

    // Reset clicked position
    if (this.pickedPiece.row == row && this.pickedPiece.col == col) {
      this.pickedPiece = null;
      this.changeState(STATES.PickPiece);
      return;
    }

    // Check other move conditions
    if (!isMovement) {
      this.pickedPiece = { row, col };
      return;
    }

    // Move piece
    this.pickedMove = { row, col };
    this.startPieceMovement();
  }

  movePieceHandler() {
    if (this.animator.hasAnimations()) return;

    const upgrade = this.gameBoard.executeMove(
      this.playerTurn,
      this.currentPieceID,
      this.pickedMove
    );

    if (upgrade) {
      const queenPiece = this.gameBoard.getPlayerPieces(this.playerTurn)[1];
      this.animator.addEvolutionAnimation(queenPiece, this.pickedMove);
      this.changeState(STATES.UpgradePiece);
      return;
    }

    this.endMove();
  }

  upgradePieceHandler() {
    if (this.animator.hasAnimations()) return;
    this.gameBoard.upgradePiece(this.playerTurn, this.pickedMove);
    this.endMove();
  }

  endMove() {
    this.pickedPiece = null;
    this.currentPieceID = null;
    
    if (!this.gameBoard.capturing) {
      this.switchTurns();
      return;
    }

    this.players[this.playerTurn].score++;
    this.gameBoard.setValidMoves(this.playerTurn, this.pickedMove);
    this.changeState(STATES.PickPiece);
  }

  verifyEndGame() {
    const currentPlayer = this.players[this.playerTurn];

    // Time out
    if (currentPlayer.time <= 0) {
      this.changeState(STATES.TimeOut);
      return;
    }

    // Verify scores
    if (this.players[PlayerIdx.Player1].score == 12) {
      this.winner = PlayerIdx.Player1;
      this.changeState(STATES.GameOver);
      return;
    }
    if (this.players[PlayerIdx.Player2].score == 12) {
      this.winner = PlayerIdx.Player2;
      this.changeState(STATES.GameOver);
      return;
    }

    // Verify if there are no more moves for current player
    if (!this.gameBoard.existMoves()) {
      if (this.pickedMove == null) {
        this.winner = 1 - this.playerTurn;
        this.changeState(STATES.GameOver);
        return;
      }

      this.switchTurns();
    }
  }

  // Displays
  display() {
    if (this.gameState == STATES.Menu) {
      //console.log("Display menu");
      return;
    }

    let canClick = true;
    if (this.gameState == STATES.MovePiece) {
      canClick = false;
    }
    if (this.gameState == STATES.UpgradePiece) {
      canClick = false;
    }

    if (this.scene.sceneInited) {
      this.gameBoardViewer.display(canClick, this.pickedPiece);
      this.theme.displayScene();
    }
    this.animator.display();
  }

  switchTurns() {
    this.changePlayer();
    this.pickedMove = null;
    this.gameBoard.setValidMoves(this.playerTurn);
    this.changeState(STATES.PickPiece);
  }

  startPieceMovement() {
    this.animator.addPieceAnimation(
      this.gameBoard.getPlayerPiece(this.pickedPiece),
      this.pickedPiece,
      this.pickedMove,
      this.gameBoard.capturing
    );

    if (this.gameBoard.capturing) {
      const intermediatePiece = this.gameBoard.intermediatePosition(
        this.pickedPiece,
        this.pickedMove
      );

      this.animator.addPieceAnimation(
        this.gameBoard.getPlayerPiece(intermediatePiece),
        intermediatePiece,
        { row: 8, col: 8 } // REVIEW - Should be a position from auxiliary board (necessary conversions)
      );
      this.gameBoard.emptyPosition(intermediatePiece);
    }

    this.currentPieceID = this.gameBoard.emptyPosition(this.pickedPiece);
    this.changeState(STATES.MovePiece);
  }

  changeState(state) {
    this.gameState = state;
  }

  changePlayer() {
    this.playerTurn ^= 1;
  }

  samePosition(pos1, pos2) {
    return pos1.row == pos2.row && pos1.col == pos2.col;
  }

  clicked() {
    if (this.scene.pickMode) return null;

    let click = null;
    if (this.scene.pickResults.length > 0) {
      for (let i = 0; i < this.scene.pickResults.length; i++) {
        const clickInfo = this.scene.pickResults[i][0];
        if (!clickInfo) continue;

        click = clickInfo;
        break;
      }
      this.scene.pickResults.splice(0, this.scene.pickResults.length);
    }
    return click;
  }
}
