import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyPieceAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos, endPos) {
    super(scene);
    this.piece = piece;
    this.startPos = startPos;
    this.endPos = endPos;

    this.setupKeyframes();
    super.updateTimes();
  }

  setupKeyframes() {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const startKeyframe = {
      transformation,
      instant: 0,
    };

    // transformation = {
    //   translate: [translationVect.row / 2, 1.0, translationVect.col / 2],
    //   scale: [1.0, 1.0, 1.0],
    //   rotate: vec3.create(),
    // };

    // const intermediateKeyFrame = {
    //   transformation,
    //   instant: 2.5*1000,
    // };

    transformation = {
      translate: [
        (this.endPos.col - this.startPos.col) * 4,
        0.0,
        (this.endPos.row - this.startPos.row) * 4,
      ],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const endKeyframe = {
      transformation: transformation,
      instant: 0.5 * Math.abs(this.endPos.col - this.startPos.col) * 1000, // 5 seconds
    };

    this.keyframes = [startKeyframe, endKeyframe];
  }
}
