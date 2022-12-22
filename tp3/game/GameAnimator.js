import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";
import PieceView from "./views/PieceView.js";

export default class GameAnimator {
  constructor(scene) {
    this.scene = scene;
    this.pieceAnimations = [];
  }

  setViewers(gameBoardViewer) {
    this.piecesViewer = gameBoardViewer.piecesViewer;
  }

  addPieceAnimation(piece, startPos, endPos) {
    const animation = new MyPieceAnimation(this.scene, piece, startPos, endPos);
    this.pieceAnimations.push(animation);
  }

  hasPieceAnimations() {
    return this.pieceAnimations.length > 0;
  }

  manage() {
    for (let i = 0; i < this.pieceAnimations.length; i++) {
      if (this.pieceAnimations[i].hasEnded()) {
        this.pieceAnimations.splice(i, 1);
        i--;
      }
    }
  }

  update(time) {
    this.pieceAnimations.forEach((animation) => {
      animation.update(time);
    });
  }

  display() {
    this.pieceAnimations.forEach((animation) => {
      animation.apply();
      this.piecesViewer.display(animation.startPos, animation.piece);
    });
  }
}