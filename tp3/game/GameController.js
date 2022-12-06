import GameBoard from './models/GameBoard.js';
import Player from './models/Player.js';

const STATES = Object.freeze({
    Menu: 0,
    PickPiece: 1,
    PickMove: 2,
    MovePiece: 3,
    TimeOut: 4,
    GameOver: 5
});

const ID = Object.freeze({
    Player1: 0,
    Player2: 1,
});

export default class GameController {
    constructor(scene) {
        // States
        this.gameState = STATES.Menu;
        this.playerTurn = ID.Player1;
        
        // Models
        this.players = [ new Player(ID.Player1), new Player(ID.Player2) ];
        this.gameBoard = new GameBoard(ID.Player1, ID.Player2);

        // Scene
        this.scene = scene;
    }
    
}