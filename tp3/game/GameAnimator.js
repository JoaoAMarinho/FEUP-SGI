import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";

export default class GameAnimator {
  constructor(scene) {
    this.scene = scene;
    this.pieceAnimations = [];
  }

  setViewers(gameBoardViewer) {
    this.piecesViewer = gameBoardViewer.piecesViewer;
  }

  addPieceAnimation(piece, startPos, endPos, capturing=false) {
    const animation = new MyPieceAnimation(this.scene, piece, startPos, endPos, capturing);
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
      this.scene.pushMatrix();
      animation.apply();
      this.piecesViewer.display(animation.startPos, animation.piece);
      this.scene.popMatrix();
    });
  }
}