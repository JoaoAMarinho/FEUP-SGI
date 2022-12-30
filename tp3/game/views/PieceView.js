export default class PieceView {
  constructor(scene) {
    this.scene = scene;
  }

  display(pos, piece) {  
    const component = piece.component;

    let node = this.scene.graph.components[component];

    this.scene.pushMatrix();

    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(8*pos.col, 3, 8*pos.row);
    this.scene.graph.processNode(node, null, null);

    if (piece.isQueen) {
      this.displayCrown(pos);
    }
    this.scene.popMatrix();
  }

  displayCrown(pos) {
    const node = this.scene.graph.components['crown'];
    this.scene.graph.processNode(node, null, null);
  }

}