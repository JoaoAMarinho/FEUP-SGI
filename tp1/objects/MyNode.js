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

    // children
    this.primitives = [];
    this.components = [];
    
    // node attributes
    this.materials = [];
    this.transformation = null;
	}

  addComponent(component) {
    this.components.push(component);
  }

  addPrimitive(primitive) {
    this.primitives.push(primitive);
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
}

