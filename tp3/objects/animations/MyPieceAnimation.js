import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyPieceAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos, endPos, capturing) {
    super(scene);
    this.piece = piece;
    this.startPos = startPos;
    this.endPos = endPos;

    this.setupKeyframes(capturing);
    super.updateTimes();
  }

  //REVIEW - Clean code
  setupKeyframes(capturing) {
    const translationVect = {
      row: (this.endPos.row - this.startPos.row) * 4,
      col: (this.endPos.col - this.startPos.col) * 4,
    };

    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };
    let finalInstant = 0.5 * Math.abs(translationVect.col) * 1000;

    const startKeyframe = {
      transformation,
      instant: 0,
    };

    this.keyframes.push(startKeyframe);

    if (this.endPos.row > 7) {
      const keyframe = {
        transformation,
        instant: 0.77*1000,
      };
      this.keyframes.push(keyframe);

      finalInstant = 2.9 *1000;
    }

    if (capturing) {
      // TODO - Given by piece
      let sizeFactor = 6.4;
      transformation = {
        translate: [translationVect.col / sizeFactor, 0.0, translationVect.row / sizeFactor],
        scale: [1.0, 1.0, 1.0],
        rotate: vec3.create(),
      };
  
      let intermediateKeyFrame = {
        transformation,
        instant: 0.7*1000,
      };

      this.keyframes.push(intermediateKeyFrame);

      sizeFactor += 0.3;
      transformation = {
        translate: [translationVect.col / sizeFactor, 0.0, translationVect.row / sizeFactor],
        scale: [1.0, 1.0, 1.0],
        rotate: vec3.create(),
      };

      intermediateKeyFrame = {
        transformation,
        instant: intermediateKeyFrame.instant + 0.2*1000,
      };
      this.keyframes.push(intermediateKeyFrame);

      intermediateKeyFrame = {
        transformation,
        instant: intermediateKeyFrame.instant + 2*1000,
      };

      this.keyframes.push(intermediateKeyFrame);

      finalInstant += intermediateKeyFrame.instant;
    }


    transformation = {
      translate: [
        translationVect.col,
        0.0,
        translationVect.row,
      ],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const endKeyframe = {
      transformation,
      instant: finalInstant,
    };

    this.keyframes.push(endKeyframe);
  }
}
