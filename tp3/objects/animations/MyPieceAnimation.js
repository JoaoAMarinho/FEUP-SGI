import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyPieceAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos, endPos, capturing) {
    super(scene);
    this.piece = piece;
    this.startPos = startPos;
    this.endPos = endPos;
    this.capturing = capturing;
    this.translationVect = {
      row: (this.endPos.row - this.startPos.row) * 4,
      col: (this.endPos.col - this.startPos.col) * 4,
    };

    this.setupKeyframes();
    super.updateTimes();
  }

  //REVIEW - Clean code
  setupKeyframes() {
    this.addInitialAnimation();
    let finalInstant = 0.2 * Math.abs(this.translationVect.col) * 1000;

    if (this.endPos.row > 7) {
      finalInstant = this.addMoveToAuxiliarBoardAnimation();
    }

    if (this.capturing) {
      finalInstant += this.addColisionAnimation();
      finalInstant += this.addReboundAnimation();
    }

    this.addFinalAnimation(finalInstant);
  }

  addInitialAnimation() {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 0,
    };

    this.keyframes.push(keyframe);
  }

  addMoveToAuxiliarBoardAnimation() {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
        transformation,
        instant: 0.77*1000,
    };
    this.keyframes.push(keyframe);

    return 2.9 *1000;
  }

  addColisionAnimation() {
    let sizeFactor = this.piece.sizeFactor;
    const transformation = {
        translate: [this.translationVect.col / sizeFactor, 0.0, this.translationVect.row / sizeFactor],
        scale: [1.0, 1.0, 1.0],
        rotate: vec3.create(),
    };
  
    let keyframe = {
        transformation,
        instant: 0.7*1000,
    };

    this.keyframes.push(keyframe);
    return keyframe.instant;
  }

  addReboundAnimation() {
    const sizeFactor = this.piece.sizeFactor + 0.3;
    const transformation = {
      translate: [this.translationVect.col / sizeFactor, 0.0, this.translationVect.row / sizeFactor],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 0.97*1000,
    };
    this.keyframes.push(keyframe);
    
    keyframe = {
        transformation,
        instant: keyframe.instant + 2000,
    };

    this.keyframes.push(keyframe);
    return keyframe.instant;
  }

  addFinalAnimation(finalInstant) {
    const transformation = {
      translate: [
        this.translationVect.col,
        0.0,
        this.translationVect.row,
      ],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe= {
      transformation,
      instant: finalInstant,
    };

    this.keyframes.push(keyframe);
  }
}
