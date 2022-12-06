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

const ID = Object.freeze({
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
    this.playerTurn = ID.Player1;

    // Models
    this.players = [new Player(ID.Player1, configs.playerTotalTime), new Player(ID.Player2, configs.playerTotalTime)];
    this.gameBoard = new GameBoard(ID.Player1, ID.Player2);

    this.theme = new MySceneGraph(configs.theme, this.scene);

    this.changeState(STATES.PickMove);
  }

  update(time) {
    this.gameTime += time;

    switch (this.gameState) {
      case STATES.Menu:
        console.log("In menu");
        break;
      case STATES.PickMove:
        console.log("Start Game");
        break;
      case STATES.TimeOut:
        console.log("Mangoes and papayas are $2.79 a pound.");
        break;
      default:
        console.log(`Sorry, we are out of.`);
    }

    //this.animator.update(time);
  }

  display() {}

  changeState(state) {
    this.gameState = state;
  }

  changePlayer() {
    this.playerTurn |= this.playerTurn;
  }
}
