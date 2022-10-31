import { MyAnimation } from "./MyAnimation";

/**
 * MyKeyframeAnimation
 * @constructor
 * @param {CGFscene} scene - Reference to XMLscene object
 */
 export class MyKeyframeAnimation extends MyAnimation{
  constructor(scene) {
      this.scene = scene;
  }


  update(t) {
      this.components.push(component);
  }


  apply() {
      this.components.push(component);
  }
}