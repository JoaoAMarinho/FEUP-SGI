/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Object identifier
 */
export class MyNode {
	constructor(scene, id) {
		this.scene = scene;
		this.id = id;

    this.children = [];
    this.materials = [];
    this.transformation = null;
	}

  addChild(child) {
    this.children.push(child);
  }

  addMaterial(material) {
    this.materials.push(material);
  }

  setTransformation(transformation) {
    this.transformation = transformation;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  display() {
    this.scene.pushMatrix();
    if (this.transformation !== null)
      this.scene.multMatrix(this.transformation);

    for(var i = 0; i < this.children.length; i++) {
      this.children[i].display();
    }

    this.scene.popMatrix();
  }
}

