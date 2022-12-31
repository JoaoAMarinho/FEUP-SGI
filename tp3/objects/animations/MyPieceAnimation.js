import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";

export class MyPieceAnimation extends MyKeyframeAnimation {
  constructor(scene, piece, startPos, endPos, capturing, endTime) {
    super(scene);
    this.piece = piece;

    this.startPos = startPos;
    this.endPos = endPos;

    this.capturing = capturing;
    this.translationVect = {
      row: (this.endPos.row - this.startPos.row) * 4,
      col: (this.endPos.col - this.startPos.col) * 4,
    };

    this.setupKeyframes(endTime);
  }

  setupKeyframes(endTime) {
    this.addInitialAnimation();
    let finalInstant = 600;
    let offset = 0;

    if (this.endPos.col > 7) {
      offset = 2;
      finalInstant = (endTime != null) ? endTime : 2400;
      this.addWaitAnimation();
      this.addMoveUpAnimation();
      this.addMoveToFinalPosition();
      this.addFinalAnimation(2300, offset);
    }

    if (this.capturing) {
      finalInstant = 2400;
      this.addColisionAnimation();
      this.addReboundAnimation();
      this.addFinalAnimation(1500);
    }

    this.addFinalAnimation(finalInstant, offset);
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

  // animations for the auxiliar board moves
  addWaitAnimation() {
    let transformation = {
      translate: [0.0, 0.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
        transformation,
        instant: 500,
    };
    this.keyframes.push(keyframe);
  }

  addMoveUpAnimation() {
    const transformation = {
      translate: [0.0, 10.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 1000,
    };

    this.keyframes.push(keyframe);
  }

  addMoveToFinalPosition() {
    const transformation = {
      translate: [this.translationVect.col, 10.0, this.translationVect.row],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 1800,
    };
    this.keyframes.push(keyframe);
  }

  // animations for the capture moves
  addColisionAnimation() {
    let sizeFactor = this.piece.sizeFactor;
    const transformation = {
        translate: [this.translationVect.col / sizeFactor, 0.0, this.translationVect.row / sizeFactor],
        scale: [1.0, 1.0, 1.0],
        rotate: vec3.create(),
    };
  
    let keyframe = {
        transformation,
        instant: 500,
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
      instant: 750,
    };
    this.keyframes.push(keyframe);
    
    keyframe = {
        transformation,
        instant: 1000,
    };

    this.keyframes.push(keyframe);
    return keyframe.instant;
  }

  addFinalAnimation(finalInstant, offset=0) {
    const transformation = {
      translate: [
        this.translationVect.col+offset,
        0.0-offset,
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
    super.updateTimes();
  }
}
