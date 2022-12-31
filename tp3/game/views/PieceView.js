export default class PieceView {
  constructor(scene) {
    this.scene = scene;
  }

  display(pos, piece, colOffset = 0) {  
    let { height } = pos;
    const component = piece.component;

    if (!height) height = 1.7;

    let node = this.scene.graph.components[component];


    this.scene.pushMatrix();

    this.scene.translate(4*pos.col + colOffset, height, 4*pos.row);
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.graph.processNode(node, null, null);

    if (piece.isQueen) {
      this.displayCrown();
    }
    this.scene.popMatrix();
  }

  displayCrown() {
    const node = this.scene.graph.components['crown'];
    this.scene.graph.processNode(node, null, null);
  }

}