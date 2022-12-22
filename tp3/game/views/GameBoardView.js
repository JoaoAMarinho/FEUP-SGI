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
    this.base = new MyCylinder(scene, '', 22.62741, 22.62741, 2, 4, 1);
    this.baseBottom = new MyRectangle(scene, '', [-2, 30], [-2, 30]);

    this.baseMaterial = new CGFappearance(scene);
    this.baseMaterial.setAmbient(0, 0, 0, 1);
    this.baseMaterial.setDiffuse(0.2, 0.7, 0.2, 1);
    this.baseMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.baseMaterial.setShininess(120);
  }

  display(canClick, clickedPos = null) {
    this.displayBaseBorder();
    this.displayBase();
    this.displayCells(canClick, clickedPos);
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

  displayCells(canClick, clickedPos) {
    const [clicablePositions, nonClickablePositions] = this.gameBoard.filterClicablePositions(clickedPos, canClick);
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
}