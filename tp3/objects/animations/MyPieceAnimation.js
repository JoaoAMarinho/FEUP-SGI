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
    let finalInstant = 200;

    if (this.endPos.col > 7) {
      finalInstant = (endTime != null) ? endTime : 3000;
      this.addWaitAnimation(endTime);
      this.addMoveUpAnimation();
      this.addMoveToFinalPosition();
    }

    if (this.capturing) {
      finalInstant = 3000;
      this.addColisionAnimation();
      this.addReboundAnimation();
    }

    this.addFinalAnimation(finalInstant);
  }

  // animations for the auxiliar board moves
  addWaitAnimation(endTime) {
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

    if (endTime != null)
      this.addFinalAnimation(3000);
  }

  addMoveUpAnimation() {
    const transformation = {
      translate: [0.0, 3.0, 0.0],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 1200,
    };

    this.keyframes.push(keyframe);
  }

  addMoveToFinalPosition() {
    const transformation = {
      translate: [this.translationVect.col, 3.0, this.translationVect.row],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 2230,
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
      instant: 1000,
    };
    this.keyframes.push(keyframe);
    
    keyframe = {
        transformation,
        instant: 1.2*1000,
    };

    this.keyframes.push(keyframe);
    return keyframe.instant;
  }

  // comon to both movements
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
    super.updateTimes();
  }
}
