import Tile from "../models/Tile.js";
import { MyCylinder } from "../../objects/primitives/MyCylinder.js";
import { MyRectangle } from "../../objects/primitives/MyRectangle.js";
import { CGFappearance } from "../../../lib/CGF.js";

export default class GameBoardView {
  constructor(scene, gameBoard) {
    this.scene = scene;
    this.gameBoard = gameBoard;

    this.tile = new Tile(scene);
    this.base = new MyCylinder(scene, '', 22.62741, 22.62741, 2, 4, 1);
    this.baseBottom = new MyRectangle(scene, '', [-2, 30], [-2, 30]);

    this.baseMaterial = new CGFappearance(scene);
    this.baseMaterial.setAmbient(0, 0, 0, 1);
    this.baseMaterial.setDiffuse(0.2, 0.7, 0.2, 1);
    this.baseMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.baseMaterial.setShininess(120);
  }

  display(clickedPos = null) {
    this.displayBaseBorder();
    this.displayBase();
    this.displayCells(clickedPos);
  }

  displayBaseBorder() {
    this.scene.pushMatrix();
    
    this.scene.translate(14, 0, 14);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial.apply();
    this.base.display();

    this.scene.popMatrix();
  }

  displayBase() {
    this.scene.pushMatrix();
    
    this.scene.translate(0, -2, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayCells(clickedPos) {
    const board = this.gameBoard.board;
    let clicablePositions = this.gameBoard.getClicablePositions(clickedPos);
    let pickId = 1;

    //REVIEW - Improve performance
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        const clickedPos = this.containsPos(row, col, clicablePositions);
        if (clickedPos == null) {
          this.tile.display(row, col);
          continue;
        }
        console.log(clickedPos);
        this.scene.registerForPick(pickId++, clickedPos);
        this.tile.display(row, col, true, clickedPos.isMovement);
        this.scene.clearPickRegistration();
      }
    }
  }

  containsPos(row, col, array) {
    for (let i = 0; i < array.length; i++) {
      const pos = array[i];
      if (pos.row == row && pos.col == col) {
        return array.splice(i, 1)[0];
      }
    }
    return null;
  }
}