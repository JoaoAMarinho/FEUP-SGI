/**
 * MyAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to XMLscene object
 */
export class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        // Animation times
        this.startTime;
        this.endTime;
        this.totalTime = 0;

        this.active = false;
        this.currentTransformation = mat4.create();
    }

    updateTimes() {
        this.startTime = this.keyframes[0].instant;
        this.endTime = this.keyframes[this.keyframes.length - 1].instant;
    }

    update(t) {
    }


    apply() {
        if (!this.active)
            return;

        this.scene.multMatrix(this.currentTransformation);
    }

    isActive() {
        return this.active;
    }
}