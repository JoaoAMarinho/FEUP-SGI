export default class TransporterView {
    constructor(scene, component) {
      this.scene = scene;
      this.component = component;
    }
  
    display(angle) {
      let node = this.scene.graph.components[this.component];
      this.scene.pushMatrix();
  
      this.scene.rotate(angle, 0, 1, 0);
      this.scene.graph.processNode(node, null, null);
  
      this.scene.popMatrix();
    }
  }