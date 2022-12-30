import { MyCylinder } from "../../objects/primitives/MyCylinder.js";
import { MyRectangle } from "../../objects/primitives/MyRectangle.js";
import { CGFappearance, CGFtexture } from "../../../lib/CGF.js";
import TileView from "./TileView.js";
import PieceView from "./PieceView.js";

export default class GameBoardView {
  constructor(scene, gameBoard) {
    this.scene = scene;
    this.gameBoard = gameBoard;

    // Views
    this.tilesViewer = new TileView(scene);
    this.piecesViewer = new PieceView(scene);

    // GameBoard parts
    this.baseBorders = new MyCylinder(scene, "", 25.456, 25.456, 2, 4, 1);
    this.baseBottom = new MyRectangle(scene, "", [-4, 32], [-4, 32]);
    
    const texture = new CGFtexture(this.scene, "./scenes/images/granit.jpg");

    this.blackMaterial = new CGFappearance(scene);
    this.blackMaterial.setEmission(0.0, 0.2, 1.0, 1);
    this.blackMaterial.setAmbient(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setDiffuse(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setSpecular(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setShininess(120);

    this.blackMaterial.setTexture(texture);

    this.whiteMaterial = new CGFappearance(scene);
    this.whiteMaterial.setAmbient(1, 1, 1, 1);
    this.whiteMaterial.setDiffuse(0, 0, 0, 1);
    this.whiteMaterial.setSpecular(0, 0, 0, 1);
    this.whiteMaterial.setShininess(120);

  }

  display(canClick, clickedPos = null) {
    this.displayMainBoard();
    this.displayAuxiliarBoard();
    this.displayCells(canClick, clickedPos);
  }

  displayMainBoard() {
    // Display borders
    this.scene.pushMatrix();

    this.scene.translate(14, 0, 14);
    this.displayBoard();
    
    this.scene.popMatrix();

    // Display bottom base
    this.scene.pushMatrix();

    this.scene.translate(0, -2, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();

    // Display top
    this.scene.pushMatrix();

    this.scene.translate(0, 0, 28);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayBoard() {
    this.scene.pushMatrix();

    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBorders.display();

    this.scene.popMatrix();
  }

  displayAuxiliarBoard() {
    this.displayAuxiliarBoardOutside();
    this.displayAuxiliarBoardInside();
    this.displayAuxiliarBoardPieces();
  }

  displayAuxiliarBoardOutside() {
    this.scene.pushMatrix();

    this.scene.translate(38, 0, 14);
    this.scene.scale(3 / 9, 1, 1);
    this.displayBoard();

    this.scene.popMatrix();

    // Display bottom base
    this.scene.pushMatrix();

    this.scene.translate(38, -2, 0);
    this.scene.scale(3 / 9, 1, 1);
    this.scene.translate(-14, 0, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayAuxiliarBoardInside() {
    // Display borders
    this.scene.pushMatrix();

    this.scene.translate(38, -2, 14);
    this.scene.scale(3 / 9, 1, 1);
    this.scene.scale(1, -1, 1);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBorders.display();

    this.scene.popMatrix();

    // Display base top
    this.scene.pushMatrix();

    this.scene.translate(38, -2, 0);
    this.scene.scale(3 / 9, 1, 1);
    this.scene.translate(14, 0, 0);
    this.scene.scale(-1, 1, 1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
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
      this.tilesViewer.display(pos.row, pos.col, true);
      this.displayPiece(pos);
    }
    this.scene.clearPickRegistration();
  }

  displayAuxiliarBoardPieces() {
    const auxiliarBoard = this.gameBoard.auxiliarBoard;

    for(let i=0; i < auxiliarBoard.length; i++)
      for (let j = 0; j < auxiliarBoard[1].length; j++)
        this.displayAuxiliarBoardPiece(i, j);
      
  }

  displayPiece(pos) {
    const piece = this.gameBoard.getPlayerPiece(pos);

    if (piece == null) return;
    this.piecesViewer.display(pos, piece);
  }

  displayAuxiliarBoardPiece(row, col) {
    const piece = this.gameBoard.getAuxiliarBoardPiece({row, col})

    if (piece == null) return;
    this.piecesViewer.display({row, col: col + 8, height: -0.5}, piece, 2);
  }
}
