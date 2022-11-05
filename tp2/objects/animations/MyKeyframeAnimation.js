import { MyAnimation } from "./MyAnimation.js";

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
                this.updateTransformationMatrix(this.keyframes[this.keyframes.length-1].transformation);
                this.finalKeyframe = true;
            }
            return;
        }

        if (!this.active) {
            if (this.totalTime > this.startTime) 
                this.active = true;
            else
                return;
        }

        // Update keyframeIndex
        while (this.totalTime > this.keyframes[this.keyframeIndex+1].instant) {
            this.keyframeIndex++;
            if (this.keyframeIndex == (this.keyframes.length-1)) break;
        }

        const currentKeyframe = this.keyframes[this.keyframeIndex];
        const nextKeyframe = this.keyframes[this.keyframeIndex + 1];

        const timePercentage = (this.totalTime - currentKeyframe.instant) / (nextKeyframe.instant - currentKeyframe.instant);

        var newTransformation = {
            translate: [],
            scale: [],
            rotate: vec3.create(),
        };

        vec3.lerp(newTransformation.translate, currentKeyframe.transformation.translate, nextKeyframe.transformation.translate, timePercentage);
        vec3.lerp(newTransformation.scale, currentKeyframe.transformation.scale, nextKeyframe.transformation.scale, timePercentage);
        vec3.lerp(newTransformation.rotate, currentKeyframe.transformation.rotate, nextKeyframe.transformation.rotate, timePercentage);

        this.updateTransformationMatrix(newTransformation);
    }

    updateTransformationMatrix(transformation) {
        var {translate , rotate, scale} = transformation;
        var matrix = mat4.create();

        mat4.translate(matrix, matrix, translate);
        mat4.rotate(matrix, matrix, rotate[0], [1, 0, 0]);
        mat4.rotate(matrix, matrix, rotate[1], [0, 1, 0]);
        mat4.rotate(matrix, matrix, rotate[2], [0, 0, 1]);
        mat4.scale(this.currentTransformation, matrix, scale);
    }
}