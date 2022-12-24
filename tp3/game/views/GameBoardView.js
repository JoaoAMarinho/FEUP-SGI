import { MyCylinder } from "../../objects/primitives/MyCylinder.js";
import { MyRectangle } from "../../objects/primitives/MyRectangle.js";
import { CGFappearance } from "../../../lib/CGF.js";
import TileView from "./TileView.js";
import PieceView from "./PieceView.js";

export default class GameBoardView {
  constructor(scene, gameBoard, pieceType) {
    this.scene = scene;
    this.gameBoard = gameBoard;

    // Views
    this.tilesViewer = new TileView(scene);
    this.piecesViewer = new PieceView(scene, pieceType);

    // GameBoard parts
    this.baseBorders = new MyCylinder(scene, "", 22.62741, 22.62741, 2, 4, 1);
    this.baseBottom = new MyRectangle(scene, "", [-2, 30], [-2, 30]);

    this.auxiliarBoard = {
      row: 0,
      col: 8 * 4 + 1,
    };

    this.baseMaterial = new CGFappearance(scene);
    this.baseMaterial.setAmbient(0.2, 0.7, 0, 1);
    this.baseMaterial.setDiffuse(0.2, 0.7, 0.2, 1);
    this.baseMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.baseMaterial.setShininess(120);

    this.baseMaterial2 = new CGFappearance(scene);
    this.baseMaterial2.setAmbient(0.5, 0.6, 0, 1);
    this.baseMaterial2.setDiffuse(0.5, 0.6, 0.2, 1);
    this.baseMaterial2.setSpecular(0.0, 0.0, 0.0, 1);
    this.baseMaterial2.setShininess(120);
  }

  display(canClick, clickedPos = null) {
    this.displayMainBoard();
    this.displayAuxiliaryBoard();
    this.displayCells(canClick, clickedPos);
  }

  displayMainBoard() {
    // Display borders
    this.scene.pushMatrix();

    this.scene.translate(14, 0, 14);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial2.apply();
    this.baseBorders.display();

    this.scene.popMatrix();

    // Display bottom base
    this.scene.pushMatrix();

    this.scene.translate(0, -2, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayCells(canClick, clickedPos) {
    const [clicablePositions, nonClickablePositions] =
      this.gameBoard.filterClicablePositions(clickedPos, canClick);
    let pickId = 1;

    for (let pos of nonClickablePositions) {
      pos = JSON.parse(pos);
      this.tilesViewer.display(pos.row, pos.col);
      this.displayPiece(pos);
    }

    for (const pos of clicablePositions) {
      this.scene.registerForPick(pickId++, pos);
      this.tilesViewer.display(pos.row, pos.col, true, pos.isMovement);
      this.displayPiece(pos);
    }

    this.scene.clearPickRegistration();
  }

  displayPiece(pos) {
    const piece = this.gameBoard.getPlayerPiece(pos);

    if (piece == null) return;
    this.piecesViewer.display(pos, piece);
  }

  displayAuxiliaryBoard() {
    this.displayAuxiliaryBoardOutside();
    this.displayAuxiliaryBoardInside();
  }

  displayAuxiliaryBoardOutside() {
    this.scene.pushMatrix();

    this.scene.scale(3 / 8, 1, 1);
    this.scene.translate((33 * 8) / 3, 0, 0);
    this.displayMainBoard();

    this.scene.popMatrix();
  }

  displayAuxiliaryBoardInside() {
    this.scene.pushMatrix();
    this.scene.scale(3 / 8, 1, 1);
    this.scene.translate((33 * 8) / 3, 0, 0);

    // Display borders
    this.scene.pushMatrix();

    this.scene.translate(14, -2, 14);
    this.scene.scale(1, -1, 1);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial2.apply();
    this.baseBorders.display();

    this.scene.popMatrix();

    // Display base top
    this.scene.pushMatrix();

    this.scene.translate(28, -2, 0);
    this.scene.scale(-1, 1, 1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.baseMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}
