export default class PieceView {
  constructor(scene) {
    this.scene = scene;
  }

  display(pos, piece) {  
    let { height } = pos;
    const component = piece.component;

    if (!height) height = 3;

    let node = this.scene.graph.components[component];


    this.scene.pushMatrix();

    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(8*pos.col, height, 8*pos.row);
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