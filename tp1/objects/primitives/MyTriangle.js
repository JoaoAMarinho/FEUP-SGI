import { CGFobject } from '../../../lib/CGF.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id -  Object identifier
 * @param x - Coords of triangle vertices in X
 * @param y - Coords of triangle vertices in Y
 * @param z - Coords of triangle vertices in Z
 */
export class MyTriangle extends CGFobject {
    constructor(scene, id, x, y, z) {
        super(scene);
        this.id = id;

        [this.x1, this.x2, this.x3] = x;
        [this.y1, this.y2, this.y3] = y;
        [this.z1, this.z2, this.z3] = z;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1,	  //0
            this.x2, this.y2, this.z2,	  //1
            this.x3, this.y3, this.z3,	  //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
        ];

        this.normals = [];
        for (var i = 0; i < 3; i++) {
            this.normals.push(0, 0, 1);
        }
        for (var i = 0; i < 3; i++) {
            this.normals.push(0, 0, -1);
        }

        this.texCoords = [
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            0, 1,
            1, 1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
    * @method updateTexCoords
    * Updates the list of texture coordinates of the rectangle
    * @param {Array} coords - Array of texture coordinates
    */
    updateTexCoords(coords) {
        //TODO verify if correct
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}
