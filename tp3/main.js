import { CGFapplication } from "../lib/CGF.js";
import { XMLscene } from "./XMLscene.js";
import { MyInterface } from "./MyInterface.js";
import GameController from "./game/GameController.js";

function main() {
  // Standard application, scene and interface setup
  var app = new CGFapplication(document.body);
  var myInterface = new MyInterface();
  var myScene = new XMLscene(myInterface);

  app.init();

  app.setScene(myScene);
  app.setInterface(myInterface);

  //myInterface.setActiveCamera(myScene.camera);

  var myGameController = new GameController(myScene);
  myScene.setGameController(myGameController);

  // start
  app.run();
}

main();
