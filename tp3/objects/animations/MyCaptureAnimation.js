import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";
import {angle} from "../../game/GameUtils.js"

export class MyCaptureAnimation extends MyKeyframeAnimation {
  constructor(scene, startPos, intermediatePos, endPos, endTime) {
    super(scene);

    this.startPos = startPos;
    this.intermediatePos = intermediatePos;
    this.endPos = endPos;

    this.translationVect = {
      row: (this.endPos.row - this.intermediatePos.row) * 4,
      col: (this.endPos.col - this.intermediatePos.col) * 4,
    };
  
    this.calculateStartPos();
    
    this.setupKeyframes(endTime);
  }

  calculateStartPos(endTime) {
    finalInstant = (endTime != null) ? endTime : 3000;
    let direction = [
      (this.intermediatePos.col * 4 - this.startPos[0]),
      4 - this.startPos[1],
      (this.intermediatePos.row * 4 - this.startPos[2]),
    ];
    vec3.normalize(direction, direction);
    let facing = vec3.fromValues(0,0,1);
    this.facing = angle(facing, direction);
    
    vec3.scale(direction, direction, 3);
    vec3.sub(this.startPos, this.startPos, direction);
  }

  setupKeyframes() {
    this.addInitialAnimation();
    this.addMoveToPiecePosition();
    this.addMoveUpAnimation();
    this.addMoveToFinalPosition();
    this.addFinalAnimation(finalInstant);
  }

  addInitialAnimation() {
    let transformation = {
      translate: [...this.startPos],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 0,
    };

    this.keyframes.push(keyframe);

  }

  addMoveToPiecePosition() {
    let transformation = {
      translate: [this.intermediatePos.col*4, 0.0, this.intermediatePos.row*4],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 1000,
    };
    this.keyframes.push(keyframe);
  }

  addMoveUpAnimation() {
    const transformation = {
      translate: [this.intermediatePos.col *4, 3.0, this.intermediatePos.row *4],
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
      translate: [this.endPos.col*4, 3.0, this.endPos.row*4],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 2230,
    };
    this.keyframes.push(keyframe);
  }

  addFinalAnimation(finalInstant) {
    const transformation = {
      translate: [this.endPos.col * 4, 0.0, this.endPos.row * 4],

      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: finalInstant,
    };

    this.keyframes.push(keyframe);
    super.updateTimes();
  }
}
