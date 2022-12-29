import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyEvolutionAnimation extends MyKeyframeAnimation {
  constructor(scene, startPos, startTime) {
    super(scene);
    this.startPos = startPos;

    this.setupKeyframes(startTime);
    super.updateTimes();
  }

  setupKeyframes(startTime) {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [0.0, 0.0, 0.0],
      rotate: [0.0, 0.0, 0.0],
    };

    let keyframe = {
      transformation,
      instant: startTime,
    };

    this.keyframes.push(keyframe);

    transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [0.5, 0.5, 0.5],
      rotate: [0.0, 180.0, 0.0],
    };

    keyframe = {
      transformation,
      instant: keyframe.instant + 1500,
    };

    this.keyframes.push(keyframe);
  }

  apply() {
    this.scene.translate(4 * this.startPos.col, 1.5, 4 * this.startPos.row);
    super.apply();
  }
}
