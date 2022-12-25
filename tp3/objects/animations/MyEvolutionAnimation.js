import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyEvolutionAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos) {
    super(scene);
    this.startPos = startPos;
    this.piece = piece;
    this.setupKeyframes();
    super.updateTimes();
  }

  setupKeyframes() {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [0.0, 0.0, 0.0],
      rotate: [0.0, 0.0, 0.0],
    };

    let keyframe = {
      transformation,
      instant: 0,
    };

    this.keyframes.push(keyframe);

    transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [0.5, 0.5, 0.5],
      rotate: [0.0, 90.0, 0.0],
    };

    keyframe = {
      transformation,
      instant: 2000,
    };

    this.keyframes.push(keyframe);

    transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 180.0, 0.0],
    };

    keyframe = {
      transformation,
      instant: 4000,
    };

    this.keyframes.push(keyframe);
  }

  apply() {
    if (!this.active) return;
    this.scene.translate(4*this.startPos.col, 0.0, 4* this.startPos.row);
    this.scene.multMatrix(this.currentTransformation);
    this.scene.translate(-4*this.startPos.col, 0.0, -4*this.startPos.row);
  }
}
