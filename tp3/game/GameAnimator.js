import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";
import { MyEvolutionAnimation } from "../objects/animations/MyEvolutionAnimation.js";
import { MyCaptureAnimation } from "../objects/animations/MyCaptureAnimation.js";
import TransporterView from "./views/TransporterView.js";

export default class GameAnimator {
  constructor(scene) {
    this.scene = scene;
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
    this.captureAnimation = null;
  }

  setViewers(gameBoardViewer, transporter) {
    this.piecesViewer = gameBoardViewer.piecesViewer;
    this.transporterViewer = new TransporterView(this.scene, transporter);
  }

  createPieceAnimation(piece, startPos, endPos, capturing, endTime = null) {
    const animation = new MyPieceAnimation(
      this.scene,
      piece,
      startPos,
      endPos,
      capturing,
      endTime
    );
    this.addPieceAnimation(animation);
    return animation;
  }

  createEvolutionAnimation(position, startTime) {
    const animation = new MyEvolutionAnimation(
      this.scene,
      position,
      startTime
    );
    this.setEvolutionAnimation(animation);
    return animation;
  }

  createCaptureAnimation(startPos, intermediatePos, endPos) {
    const animation = new MyCaptureAnimation(
      this.scene,
      startPos,
      intermediatePos,
      endPos,
    );
    this.setCaptureAnimation(animation);
    return animation;
  }

  addPieceAnimation(animation) {
    this.pieceAnimations.push(animation);
  }

  setEvolutionAnimation(animation) {
    this.upgradingAnimation = animation;
  }

  setCaptureAnimation(animation) {
    this.captureAnimation = animation;
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

    if (this.upgradingAnimation != null && this.upgradingAnimation.hasEnded())
      this.upgradingAnimation = null;
  
    if (this.captureAnimation != null && this.captureAnimation.hasEnded())
      this.captureAnimation = null;
  }

  update(time) {
    this.pieceAnimations.forEach((animation) => {
      animation.update(time);
    });

    if (this.upgradingAnimation !== null) this.upgradingAnimation.update(time);

    if (this.captureAnimation !== null) this.captureAnimation.update(time);
  }

  display() {
    this.pieceAnimations.forEach((animation) => {
      this.scene.pushMatrix();
      if (animation.isActive()) {
        animation.apply();
        this.piecesViewer.display(animation.startPos, animation.piece);
      }
      this.scene.popMatrix();
    });

    if (this.upgradingAnimation != null) {
      this.scene.pushMatrix();
      if (this.upgradingAnimation.isActive()) {
        this.upgradingAnimation.apply();
        this.piecesViewer.displayCrown(this.upgradingAnimation.startPos);
      }
      this.scene.popMatrix();
    }

    if (this.captureAnimation != null) {
      this.scene.pushMatrix();
      if (this.captureAnimation.isActive()) {
        this.captureAnimation.apply();
        this.transporterViewer.display(this.captureAnimation.facing);
      }
      this.scene.popMatrix();
    }
  }

  resetAnimations() {
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
    this.captureAnimation = null;
  }
}
