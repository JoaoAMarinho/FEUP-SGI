import { MyAnimation } from "./MyAnimation";

/**
 * MyKeyframeAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to XMLscene object
 */
export class MyKeyframeAnimation extends MyAnimation {
    constructor() {
        this.keyframes = [];
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
    }

}