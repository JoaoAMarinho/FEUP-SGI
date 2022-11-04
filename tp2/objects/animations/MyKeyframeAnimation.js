import { MyAnimation } from "./MyAnimation";

/**
 * MyKeyframeAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to XMLscene object
 */
export class MyKeyframeAnimation extends MyAnimation {
    constructor(scene) {
        super(scene);
        this.keyframes = [];

        this.keyframeIndex = 0;
        this.finalKeyframe = false;
    }

    addKeyframe(keyframe) {
        this.keyframes.push(keyframe);
    }

    updateTimes() {
        this.startTime = this.keyframes[0].instant;
        this.endTime = this.keyframes[this.keyframes.length - 1].instant;
    }

    update(t) {
        this.totalTime += t;

        if (this.totalTime > this.endTime) {
            if (!this.finalKeyframe) {
                this.currentTransformation = this.createTransformation(this.keyframes[this.keyframes.length-1].transformation)
                this.finalKeyframe = true;
            }
            return;
        }

        if (!this.active && this.totalTime > this.startTime)
            this.active = true;
        else
            return;


    }
}