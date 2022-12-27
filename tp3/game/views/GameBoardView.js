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

    this.auxiliarBoard = {
      row: 0,
      col: 8 * 4 + 1,
    };

    const texture = new CGFtexture(this.scene, "./scenes/images/granit.jpg");

    this.blackMaterial = new CGFappearance(scene);
    this.blackMaterial.setEmission(0.0, 0.2, 1.0, 1);
    this.blackMaterial.setAmbient(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setDiffuse(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setSpecular(0.05, 0.05, 0.05, 1);
    this.blackMaterial.setShininess(120);

    this.blackMaterial.setTexture(texture);

    this.whiteMaterial = new CGFappearance(scene);
    this.whiteMaterial.setAmbient(0, 0, 0, 1);
    this.whiteMaterial.setDiffuse(0, 0, 0, 1);
    this.whiteMaterial.setSpecular(0, 0, 0, 1);
    this.whiteMaterial.setShininess(120);

    this.whiteMaterial.setTexture(texture);

    
  }

  display(canClick, clickedPos = null) {
    this.displayMainBoard();
    this.displayAuxiliarBoard();
    this.displayCells(canClick, clickedPos);
  }

  displayMainBoard() {
    // Display borders
   this.displayBoard(this.blackMaterial);

    // Display top
    this.scene.pushMatrix();

    this.scene.translate(0, 0, 28);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayBoard(material) {
    this.scene.pushMatrix();

    this.scene.translate(14, 0, 14);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    material.apply();
    this.baseBorders.display();

    this.scene.popMatrix();

    // Display bottom base
    this.scene.pushMatrix();

    this.scene.translate(0, -2, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    material.apply();
    this.baseBottom.display();

    this.scene.popMatrix();
  }

  displayAuxiliarBoard() {
    this.displayAuxiliarBoardOutside();
    this.displayAuxiliarBoardInside();
    this.displayAuxiliarBoardPieces();
  }

  displayAuxiliarBoardOutside() {
    this.scene.pushMatrix();

    this.scene.translate(33.8, 0, 0);
    this.scene.scale(3 / 8, 1, 1);
    this.displayBoard(this.blackMaterial);

    this.scene.popMatrix();
  }

  displayAuxiliarBoardInside() {
    this.scene.pushMatrix();
    this.scene.scale(3 / 8, 1, 1);
    this.scene.translate((33 * 8) / 3, 0, 0);

    // Display borders
    this.scene.pushMatrix();

    this.scene.translate(16, -2, 14);
    this.scene.scale(1, -1, 1);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.whiteMaterial.apply();
    this.baseBorders.display();

    this.scene.popMatrix();

    // Display base top
    this.scene.pushMatrix();

    this.scene.translate(30, -2, 0);
    this.scene.scale(-1, 1, 1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.blackMaterial.apply();
    this.baseBottom.display();

    this.scene.popMatrix();

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
    this.piecesViewer.display({row: row, col: col + 8}, piece);
  }
}
