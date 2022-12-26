import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyEvolutionAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos) {
    super(scene);
    this.piece = piece;
    this.startPos = startPos;
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
    this.scene.translate(this.startPos.col, 0.0, this.startPos.row);
    super.apply();
    this.scene.translate(this.startPos.col, 0.0, this.startPos.row);
  }
}
