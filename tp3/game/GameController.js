import GameBoard from "./models/GameBoard.js";
import Player from "./models/Player.js";
import { MySceneGraph } from "../MySceneGraph.js";

const STATES = Object.freeze({
    Menu: 0,
    PickPiece: 1,
    PickMove: 2,
    MovePiece: 3,
    TimeOut: 4,
    GameOver: 5,
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
            new Player(configs.playerTotalTime), // Player 1
            new Player(configs.playerTotalTime), // Player 2
        ];
        this.gameBoard = new GameBoard(this.scene);

        // this.theme = new MySceneGraph(configs.theme, this.scene);

        this.gameBoard.setValidMoves(this.playerTurn);
        this.changeState(STATES.PickPiece);
    }

    update(time) {
        this.gameTime += time;

        switch (this.gameState) {
            case STATES.Menu:
                // console.log("In menu");
                break;
            case STATES.MovePiece:
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
        if (this.gameState == STATES.Menu) {
            //console.log("In menu");
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
        if (this.delay > 0) return;

        this.gameBoard.executeMove(
            this.playerTurn,
            this.pickedPiece,
            this.pickedMove
        );
        this.pickedPiece = null;

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
            this.changeState(STATES.GameOver);
            this.winner = PlayerIdx.Player1;
            return;
        }
        if (this.players[PlayerIdx.Player2].score == 12) {
            this.changeState(STATES.GameOver);
            this.winner = PlayerIdx.Player2;
            return;
        }

        // Verify if there are no more moves for current player
        if (!this.gameBoard.existMoves()) {
            const opponentMoves = this.gameBoard.getValidMoves(
                1 - this.playerTurn
            ).moves;
            if (
                this.pickedMove != null ||
                Object.keys(opponentMoves).length > 0
            ) {
                this.switchTurns();
                return;
            }

            // No one has moves
            this.changeState(STATES.GameOver);
        }
    }

    // Displays
    display() {
        if (this.gameState == STATES.Menu) {
            //console.log("Display menu");
            return;
        }

        if (this.gameState == STATES.MovePiece) {
            //console.log("Display moving piece");
        }

        this.gameBoard.display(this.pickedPiece);

        // this.theme.display();
        // this.gameBoard.display();
        // this.animator.display();
    }

    switchTurns() {
        console.log("Switching turns");
        this.changePlayer();
        this.pickedMove = null;
        this.gameBoard.setValidMoves(this.playerTurn);
        this.changeState(STATES.PickPiece);
    }

    startPieceMovement() {
        this.delay = 15;
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
