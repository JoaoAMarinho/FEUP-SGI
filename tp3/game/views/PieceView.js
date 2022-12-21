export default class PieceView {
  constructor(scene, component) {
    this.scene = scene;
    this.component = component;
  }

  display(pos, piece) {
    //TODO - style piece according to player & queen
    const node = this.scene.graph.components[this.component];

    this.scene.pushMatrix();

    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(8*pos.col, 3, 8*pos.row);
    this.scene.graph.processNode(node, null, null);
    
    this.scene.popMatrix();
  }
}