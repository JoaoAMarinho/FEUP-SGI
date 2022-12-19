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

        this.players[this.playerTurn].setMoves(
            this.gameBoard.getValidMoves(this.playerTurn)
        );
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

        if (this.gameState == STATES.PickMove) {
            //console.log("Picking move");
            return;
        }

        if (this.gameState == STATES.PickPiece) {
            this.pickPieceHandler();
            return;
        }

        if (this.gameState == STATES.MovePiece) {
        }
    }

    pickPieceHandler() {
        const clickedPos = this.clicked();
        if (clickedPos.length == 0) return;

        console.log(clickedPos);

        
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
        if (!currentPlayer.hasMoves()) {
            const opponentMoves = this.gameBoard.getValidMoves(
                1 - this.playerTurn
            );
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
        switch (this.gameState) {
            case STATES.Menu:
                //console.log("Display menu");
                break;
            case STATES.PickPiece:
                this.gameBoard.display(
                    this.players[this.playerTurn].getPlayablePositions()
                );
                break;
        }
        // this.theme.display();
        // this.gameBoard.display();
        // this.animator.display();
    }

    // Utils
    switchTurns() {
        this.changePlayer();
        this.startPos = null;
        this.players[this.playerTurn].setMoves(
            this.gameBoard.getValidMoves(this.playerTurn)
        );
        this.changeState(STATES.PickMove);
    }

    changeState(state) {
        this.gameState = state;
    }

    changePlayer() {
        this.playerTurn ^= 1;
    }

    clicked() {
        if (this.scene.pickMode)
            return [];
        
        const clicks = [];
        if (this.scene.pickResults.length > 0) {
            for (let i = 0; i < this.scene.pickResults.length; i++) {
                const obj = this.scene.pickResults[i][0];
                if (!obj)
                    continue;

                clicks.push(obj);
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
        return clicks;
    }
}
