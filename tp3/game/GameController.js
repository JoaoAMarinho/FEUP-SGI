import GameBoard from "./models/GameBoard.js";
import GameBoardView from "./views/GameBoardView.js";
import Player from "./models/Player.js";
import { MySceneGraph } from "../MySceneGraph.js";
import GameAnimator from "./GameAnimator.js";
import GameCamera from "./GameCamera.js";
import GameMenuView from "./views/GameMenuView.js";
import * as Utils from "./GameUtils.js";
import GameSequences from "./models/GameSequences.js";
import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";

const STATES = Object.freeze({
  Menu: 0,
  PickPiece: 1,
  PickMove: 2,
  MovePiece: 3,
  Undo: 4,
  Film: 5, // Review may not be necessary
  TimeOut: 6,
  GameOver: 7,
});

const PlayerIdx = Object.freeze({
  Player1: 0,
  Player2: 1,
});

const TurnTime = 300000; // 5 min in miliseconds

export default class GameController {
  constructor(scene) {
    this.scene = scene;

    this.gameState = STATES.Menu;
    this.camera = new GameCamera(scene.camera);
    this.animator = new GameAnimator(scene);
    this.menuViewer = new GameMenuView(scene);
    this.gameSequences = new GameSequences();
    this.gameSettings = "Space";
  }

  startGame() {
    this.playerTurn = PlayerIdx.Player1;
    this.gameTime = TurnTime;
    this.pickedPiece = null;
    this.pickedMove = null;

    this.players = [
      // REVIEW change to scores
      new Player(), // Player 1
      new Player(), // Player 2
    ];

    this.gameSettings = this.initSettings();
    this.theme = new MySceneGraph(this.gameSettings.theme, this.scene);

    this.gameBoard = new GameBoard(
      this.scene,
      this.gameSettings.pieceSizeFactor
    );
    this.gameBoardViewer = new GameBoardView(this.scene, this.gameBoard);

    this.animator.setViewers(this.gameBoardViewer);

    this.gameBoard.setValidMoves(this.playerTurn);
    this.changeState(STATES.PickPiece);
  }

  initSettings() {
    const settings = {
      Space: {
        theme: "space.xml",
        pieceSizeFactor: 6.4,
      },
      Classic: {
        theme: "wood.xml",
        pieceSizeFactor: 0.5,
      },
    };
    return settings[this.gameSettings];
  }

  update(time) {
    this.animator.update(time);
    this.camera.update(time);

    if ([STATES.PickPiece, STATES.PickMove].includes(this.gameState)) {
      this.gameTime -= time;
    }
  }

  manage() {
    const click = this.clicked();

    if (this.gameState == STATES.Menu) {
      this.menuHandler(click);
      return;
    }

    this.animator.manage();
    const handledClick = this.clickHandler(click);

    if (this.gameState == STATES.MovePiece) {
      this.movePieceHandler();
      return;
    }

    // NOTE - missing
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

    this.verifyEndGame();

    if (handledClick) return;

    if (this.gameState == STATES.PickMove) {
      this.pickMoveHandler(click);
      return;
    }

    if (this.gameState == STATES.PickPiece) {
      this.pickPieceHandler(click);
      return;
    }
  }

  // State Handlers
  menuHandler(clickedButton) {
    if (clickedButton == null) return;

    const { button } = clickedButton;
    if (button == "Play") {
      this.startGame();
      return;
    }
    this.gameSettings = button;
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
    this.setupPieceAnimations();
  }

  movePieceHandler() {
    if (this.animator.hasAnimations()) return;

    this.gameBoard.executeMove(
      this.currentPieceID,
      this.playerTurn,
      this.pickedMove
    );

    this.pickedPiece = null;

    if (!this.gameBoard.capturing) {
      this.switchTurns();
      return;
    }

    this.gameBoard.fillAuxiliarBoard(this.playerTurn, this.intermediatePieceID);

    this.players[this.playerTurn].score++;
    this.gameBoard.setValidMoves(this.playerTurn, this.pickedMove);
    this.changeState(STATES.PickPiece);

    this.pickedMove = null;
    this.currentPieceID = null;
    this.intermediatePieceID = null;
  }

  verifyEndGame() {
    // Time out
    if (this.gameTime <= 0) {
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
      this.menuViewer.displayMainMenu(this.gameSettings);
      return;
    }

    const canClick = this.gameState != STATES.MovePiece;

    if (this.scene.sceneInited) {
      this.gameBoardViewer.display(canClick, this.pickedPiece);
      this.theme.displayScene();
    }
    const disableButtons = [
      STATES.MovePiece,
      STATES.Undo,
      STATES.Film,
    ].includes(this.gameState);

    this.animator.display();
    this.menuViewer.displayGameMenu(
      Utils.parseTime(this.gameTime),
      disableButtons
    );
  }

  switchTurns() {
    this.pickedMove = null;
    this.currentPieceID = null;
    this.intermediatePieceID = null;

    this.changePlayer();
    this.gameBoard.setValidMoves(this.playerTurn);
    this.changeState(STATES.PickPiece);
  }

  setupPieceAnimations() {
    const playerPiece = this.gameBoard.getPlayerPiece(this.pickedPiece);
    let animation = this.addAnimation(
      [
        playerPiece,
        this.pickedPiece,
        this.pickedMove,
        this.gameBoard.capturing,
      ],
      true
    );
    let totalTime = animation.endTime;

    const upgrade = this.gameBoard.isUpgradeMove(
      this.playerTurn,
      this.pickedPiece,
      this.pickedMove
    );

    if (upgrade) {
      animation = this.addAnimation(
        [playerPiece, this.pickedMove, totalTime],
        false,
        "evolution"
      );
      totalTime = animation.endTime
    }

    if (this.gameBoard.capturing) this.setupCaptureAnimation(totalTime);

    this.currentPieceID = this.gameBoard.emptyPosition(this.pickedPiece);
    this.changeState(STATES.MovePiece);
  }

  setupCaptureAnimation(endTime) {
    const intermediatePos = this.gameBoard.intermediatePosition(
      this.pickedPiece,
      this.pickedMove
    );

    const piece = this.gameBoard.getPlayerPiece(intermediatePos);
    const auxiliarBoardPos = this.gameBoard.getAuxiliarBoardPosition(
      1 - this.playerTurn
    );

    const animation = this.addAnimation([
      piece,
      intermediatePos,
      auxiliarBoardPos,
      false,
      endTime,
    ]);

    this.intermediatePieceID = this.gameBoard.emptyPosition(intermediatePos);
    return animation.endTime;
  }

  addAnimation(animationParams, isSequence = false, animationType = "piece") {
    let animation;

    if (animationType == "piece")
      animation = this.animator.createPieceAnimation(...animationParams);
    else animation = this.animator.createEvolutionAnimation(...animationParams);

    if (isSequence) this.gameSequences.addSequence(animation);
    else this.gameSequences.addAnimation(animation);

    return animation;
  }

  undoMove() {
    const sequence = this.gameSequences.undo();
    if (!sequence) return;

    for (let i = sequence.length - 1; i >= 0; i--) {
      const animation = sequence[i];
      animation.revert();

      if (animation instanceof MyPieceAnimation)
        this.animator.addPieceAnimation(animation);
      else {
        this.animator.setEvolutionAnimation(animation);
        this.gameBoard.downgradePiece(animation.startPos);
      }
    }

    this.changeState(STATES.Undo);
  }

  changeState(state) {
    this.gameState = state;
  }

  changePlayer() {
    this.gameTime = TurnTime;
    this.playerTurn ^= 1;
  }

  resetGame() {
    this.animator.resetAnimations();
    this.camera.resetPosition();
    this.gameSequences.reset();
    this.gameSettings = "Space";
    this.scene.sceneInited = false;
    this.changeState(STATES.Menu);
  }

  clickHandler(click) {
    if (click == null) return true;
    const { button } = click;

    switch (button) {
      case "Camera":
        this.camera.changeCamera();
        return true;
      case "Home":
        this.resetGame();
        return true;
      case "Undo":
        this.undoMove();
        return true;
      case "Filme":
        // TODO - film action
        return true;
      default:
        return false;
    }
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
