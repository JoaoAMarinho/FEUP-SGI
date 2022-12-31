/**
 * @class GameLight 
 * @constructor
 * @param {XMLscene} scene - Reference to MyScene object
 */
export default class GameLight {
  constructor(scene) {

    // Light created for the game
    this.light = scene.lights[0];
    this.lightAnimations = [];

    this.height = 5.0;
  }

  /**
   * @method getPosition
   * @returns {Array} light position
   */
  getPosition() {
    return this.light.location;
  }

  /**
   * @method setPosition
   * @param {Object} position 
   */
  setPosition(position) {
    this.light.setPosition(...position, 1.0);
  }

  /**
   * @method setEnabled
   * @param {Boolean} enable 
   */
  setEnabled(enable) {
    this.light.enabled = enable;
  }

  /**
   * @method startAnimation
   * @param {Object} startPos 
   * @param {Object} endPos 
   */
  startAnimation(startPos, endPos) {
    this.addInitialAnimation(startPos);

    let finalInstant = 600;

    this.addFinalAnimation(endPos, finalInstant);
    this.updateTimes(0, finalInstant);
    this.setEnabled(true);
  }

  /**
   * @method setAnimationFromKeyframes
   * Creates a light animation from a keyframe animation
   * @param {Animation Object} animation 
   */
  setAnimationFromKeyframes(animation) {
    this.addInitialAnimation(animation.startPos);
    
    const startPos = {row: animation.startPos.row * 4, col: animation.startPos.col * 4};
    const keyframes = animation.keyframes;

    for (let i = 1; i < keyframes.length-1; i++) {
      const keyframe = keyframes[i];
      const pos = [keyframe.transformation.translate[0] + startPos.col, this.height, keyframe.transformation.translate[2] + startPos.row];
      this.lightAnimations.push({
        pos,
        instant: keyframe.instant,
      });
    }

    this.updateTimes(0, this.lightAnimations[this.lightAnimations.length-1].instant);
    this.setEnabled(true);
  }

  /**
   * @method updateTimes
   * Updates the start and end times of the animation
   * @param {Integer} startTime 
   * @param {Integer} endTime 
   */
  updateTimes(startTime, endTime) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalTime = 0;
  }

  /**
   * @method addInitialAnimation
   * Adds the initial animation to the light animation array
   * @param {Object} startPos 
   */
  addInitialAnimation(startPos) {
    this.lightAnimations = [];
    this.animationIdx = 0;

    const pos = [startPos.col * 4, this.height, startPos.row * 4];
    this.setPosition(pos);
    this.lightAnimations.push({
      pos,
      instant: 0,
    });
  }

  /**
   * @method addFinalAnimation
   * Adds the final animation to the light animation array
   * @param {Object} endPos 
   * @param {Object} finalInstant 
   */
  addFinalAnimation(endPos, finalInstant) {
    this.lightAnimations.push({
      pos: [endPos.col * 4, this.height, endPos.row * 4],
      instant: finalInstant,
    });
  }

  /**
   * @method update
   * Updates the light position
   * @param {Integer} time 
   * @returns 
   */
  update(time) {
    if (this.lightAnimations.length == 0) return;

    this.totalTime += time;

    if (this.totalTime > this.endTime) {
      this.lightAnimations = [];
      this.setEnabled(false);
      this.setPosition([-1000, -1000, -1000]);
      return;
    }

    while (this.totalTime > this.lightAnimations[this.animationIdx+1].instant) {
      this.animationIdx++;
      if (this.animationIdx == this.lightAnimations.length - 1) break;
    }

    const currentAnimation = this.lightAnimations[this.animationIdx];
    const nextAnimation = this.lightAnimations[this.animationIdx + 1];

    const timePercentage =
      (this.totalTime - currentAnimation.instant) /
      (nextAnimation.instant - currentAnimation.instant);

    let newPos = [];
    vec3.lerp(
      newPos,
      currentAnimation.pos,
      nextAnimation.pos,
      timePercentage
    );
    this.setPosition(newPos);
  }
}
