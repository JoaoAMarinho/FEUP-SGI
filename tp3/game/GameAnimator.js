import { MyEvolutionAnimation } from "../objects/animations/MyEvolutionAnimation.js";
import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";

export default class GameAnimator {
  constructor(scene) {
    this.scene = scene;
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
  }

  setViewers(gameBoardViewer) {
    this.piecesViewer = gameBoardViewer.piecesViewer;
  }

  createPieceAnimation(piece, startPos, endPos, capturing=false) {
    const animation = new MyPieceAnimation(this.scene, piece, startPos, endPos, capturing);
    this.addPieceAnimation(animation);
    return animation;
  }

  createEvolutionAnimation(position) {
    const animation = new MyEvolutionAnimation(this.scene, position);
    this.setEvolutionAnimation(animation);
    return animation;
  }

  addPieceAnimation(animation) {
    this.pieceAnimations.push(animation);
  }

  setEvolutionAnimation(animation) {
    this.upgradingAnimation = animation;
  }

  hasAnimations() {
    return this.pieceAnimations.length > 0 || this.upgradingAnimation != null;
  }

  manage() {
    for (let i = 0; i < this.pieceAnimations.length; i++) {
      if (this.pieceAnimations[i].hasEnded()) {
        this.pieceAnimations.splice(i, 1);
        i--;
      }
    }

    if (this.upgradingAnimation != null && this.upgradingAnimation.hasEnded()) this.upgradingAnimation = null;
  }

  update(time) {
    this.pieceAnimations.forEach((animation) => {
      animation.update(time);
    });

    if (this.upgradingAnimation !== null) this.upgradingAnimation.update(time);
  }

  display() {
    this.pieceAnimations.forEach((animation) => {
      this.scene.pushMatrix();
      animation.apply();
      this.piecesViewer.display(animation.startPos, animation.piece);
      this.scene.popMatrix();
    });

    if (this.upgradingAnimation != null) {
      this.scene.pushMatrix();
      this.upgradingAnimation.apply();
      if (this.upgradingAnimation.isActive())
        this.piecesViewer.displayCrown(this.upgradingAnimation.startPos);
      this.scene.popMatrix();
    }
  }

  resetAnimations() {
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
  }
}