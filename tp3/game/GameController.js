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
            console.log("Moving piece");
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

        if (this.gameState == STATES.MovePiece) {
        }
    }

    pickPieceHandler(clickedPos) {
        this.clickedPos = clickedPos;
        this.changeState(STATES.PickMove);
    }

    pickMoveHandler(clickedPos) {
        console.log(clickedPos);
        if (this.samePosition(clickedPos, this.clickedPos)) {
            this.clickedPos = null;
            this.changeState(STATES.PickPiece);
            return;
        }
        
        if (!clickedPos.move)
            this.clickedPos = clickedPos;

        // Move or attack ...
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
                this.startPos != null ||
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

        this.gameBoard.display(this.clickedPos);

        // this.theme.display();
        // this.gameBoard.display();
        // this.animator.display();
    }

    // Utils
    switchTurns() {
        this.changePlayer();
        this.startPos = null;
        this.gameBoard.setValidMoves(this.playerTurn);
        this.changeState(STATES.PickMove);
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
