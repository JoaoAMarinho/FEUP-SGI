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
	}

  addChild(child) {
    this.children.push(child);
  }

  addMaterial(material) {
    this.materials.push(material);
  }

  setTransformation(transformations) {
    this.transformations = transformations;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  display() {
    for(var i = 0; i < this.children.length; i++) {
      this.children[i].display();
    }
  }
}

