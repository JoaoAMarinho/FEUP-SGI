import { MyPieceAnimation } from "../objects/animations/MyPieceAnimation.js";
import { MyEvolutionAnimation } from "../objects/animations/MyEvolutionAnimation.js";
import { MyCaptureAnimation } from "../objects/animations/MyCaptureAnimation.js";
import TransporterView from "./views/TransporterView.js";

/**
 * @class GameAnimator
 * @constructor
 * @param {XMLscene} scene - Reference to MyScene object
 */
export default class GameAnimator {
  constructor(scene) {
    this.scene = scene;
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
    this.captureAnimation = null;
  }

  /**
   * @method setViewers
   * Sets the viewers for the game
   * @param {GameBoard Viewer Object} gameBoardViewer 
   * @param {String} transporter 
   */
  setViewers(gameBoardViewer, transporter) {
    this.piecesViewer = gameBoardViewer.piecesViewer;
    this.transporterViewer = new TransporterView(this.scene, transporter);
  }

  /**
   * @method createPieceAnimation
   * Creates a piece animation 
   * @param {Piece Object} piece 
   * @param {Object} startPos 
   * @param {Object} endPos 
   * @param {Boolean} capturing 
   * @param {Integer} endTime 
   * @returns 
   */
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

  /**
   * @method createEvolutionAnimation
   * Creates an evolution animation
   * @param {Object} position 
   * @param {Integer} startTime 
   * @returns 
   */
  createEvolutionAnimation(position, startTime) {
    const animation = new MyEvolutionAnimation(
      this.scene,
      position,
      startTime
    );
    this.setEvolutionAnimation(animation);
    return animation;
  }

  /**
   * @method createCaptureAnimation
   * Creates a capture animation 
   * @param {Object} startPos 
   * @param {Object} intermediatePos 
   * @param {Object} endPos 
   * @param {Integer} endTime 
   * @returns 
   */
  createCaptureAnimation(startPos, intermediatePos, endPos, endTime) {
    const animation = new MyCaptureAnimation(
      this.scene,
      startPos,
      intermediatePos,
      endPos,
      endTime
    );
    this.setCaptureAnimation(animation);
    return animation;
  }

  /**
   * @method addPieceAnimation
   * Adds a piece animation to the list of animations
   * @param {Piece Animation Object} animation 
   */
  addPieceAnimation(animation) {
    this.pieceAnimations.push(animation);
  }

  /**
   * @method setEvolutionAnimation
   * Sets the evolution animation
   * @param {Evolution Animation Object} animation 
   */
  setEvolutionAnimation(animation) {
    this.upgradingAnimation = animation;
  }

  /**
   * @method setCaptureAnimation
   * Sets the capture animation
   * @param {Capture Animation Object} animation 
   */
  setCaptureAnimation(animation) {
    this.captureAnimation = animation;
  }

  /**
   * @method hasAnimations
   * Checks if there are any animations
   * @returns {Boolean} true if there are animations, false otherwise
   */
  hasAnimations() {
    return this.pieceAnimations.length > 0 || this.upgradingAnimation != null;
  }

  /**
   * @method manage
   * Manages the animations by removing the ones that have ended
   */
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

  /**
   * @method update
   * Updates the animations 
   * @param {Integer} time 
   */
  update(time) {
    this.pieceAnimations.forEach((animation) => {
      animation.update(time);
    });

    if (this.upgradingAnimation !== null) this.upgradingAnimation.update(time);

    if (this.captureAnimation !== null) this.captureAnimation.update(time);
  }

  /**
   * @method display
   * Displays the animations 
   */
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
        this.piecesViewer.displayCrown();
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

  /**
   * @method resetAnimations
   * Resets the animations
   */
  resetAnimations() {
    this.pieceAnimations = [];
    this.upgradingAnimation = null;
    this.captureAnimation = null;
  }
}
