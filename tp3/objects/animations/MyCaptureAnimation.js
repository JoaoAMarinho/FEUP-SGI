import { MyKeyframeAnimation } from "./MykeyFrameAnimation.js";
import { getRandomInt } from "../../game/GameUtils.js";

const AxisCombination = [
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
];

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

  calculateStartPos() {
    let direction = [
      this.intermediatePos.col * 4 - this.startPos[0],
      4 - this.startPos[1],
      this.intermediatePos.row * 4 - this.startPos[2],
    ];
    vec3.normalize(direction, direction);

    this.facing = Math.atan2(direction[0], direction[2]);
    this.startPos = this.findPointInNormalPlane(this.startPos, direction);
  }

  findPointInNormalPlane(point, normal) {
    const randomCombination =
      AxisCombination[Math.floor(Math.random() * AxisCombination.length)];

    const randomPoint = [];
    let randomPointSum = 0;
    let missingIdx;

    for (let i = 0; i < randomCombination.length; i++) {
      if (randomCombination[i] === 0) {
        randomPoint.push(null);
        randomPointSum -= normal[i] * point[i];
        missingIdx = i;
        continue;
      }

      const randomValue = getRandomInt(5, 20);
      randomPoint.push(point[i] + randomValue);
      randomPointSum += normal[i] * randomValue;
    }

    randomPointSum *= -1 / normal[missingIdx];
    randomPoint[missingIdx] = randomPointSum;

    return randomPoint;
  }

  setupKeyframes() {
    this.addInitialAnimation();
    this.addMoveToPiecePosition();
    this.addMoveUpAnimation();
    this.addMoveToFinalPosition();
    this.addMoveDownAnimation();
    this.addFinalAnimation();
  }

  addInitialAnimation() {
    let transformation = {
      translate: [...this.startPos],
      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 0.01,
    };

    this.keyframes.push(keyframe);
  }

  addMoveToPiecePosition() {
    let transformation = {
      translate: [
        this.intermediatePos.col * 4,
        4.0,
        this.intermediatePos.row * 4,
      ],
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
      translate: [
        this.intermediatePos.col * 4,
        14.0,
        this.intermediatePos.row * 4,
      ],
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
      translate: [this.endPos.col * 4, 14.0, this.endPos.row * 4],
      scale: [1.0, 1.0, 1.0],
      rotate: vec3.create(),
    };

    let keyframe = {
      transformation,
      instant: 1800,
    };
    this.keyframes.push(keyframe);
  }

  addMoveDownAnimation() {
    const transformation = {
      translate: [this.endPos.col * 4, 4.0, this.endPos.row * 4],

      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 2300,
    };

    this.keyframes.push(keyframe);
    super.updateTimes();
  }

  addFinalAnimation() {
    const transformation = {
      translate: [
        this.endPos.col * 4 + this.translationVect.col * 5,
        4.0,
        this.endPos.row * 4 + this.translationVect.row * 5,
      ],

      scale: [1.0, 1.0, 1.0],
      rotate: [0.0, 0.0, 0.0],
    };

    const keyframe = {
      transformation,
      instant: 5000,
    };

    this.keyframes.push(keyframe);
    super.updateTimes();
  }

  update(t) {
    if (this.keyframeIndex == 1) {
      this.facing = Math.atan2(
        this.translationVect.col,
        this.translationVect.row
      );
    }
    super.update(t);
  }
}
