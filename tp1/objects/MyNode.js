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

        // children ids
        this.primitives = [];
        this.components = [];

        // node attributes
        this.materials = [];
        this.texture = null;         // { id, [length_s, length_t] }
        this.transformation = null;  // {matrix, isExplicit} 
        // (If 'isExplicit' the matrix is a mat4 object, otherwise it is an id)

        this.materialIndex = 0;
        this.visited = false;
    }

    addComponent(component) {
        this.components.push(component);
    }

    addPrimitive(primitive) {
        this.primitives.push(primitive);
    }

    setMaterials(materials) {
        this.materials = materials;
    }

    setTransformation(transformation) {
        this.transformation = transformation;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setCurrentMaterial(material) {
        this.materials[this.materialIndex] = material;
    }

    getMaterial() {
        return this.materials[this.materialIndex];
    }

    nextMaterialIndex() {
        this.materialIndex = (this.materialIndex + 1) % this.materials.length;
    }
}
