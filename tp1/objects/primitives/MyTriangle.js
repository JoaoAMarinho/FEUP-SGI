import { CGFobject } from '../../../lib/CGF.js';

/**
 * MyTriangle
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {String} id -  Object identifier
 * @param {Array} x - Array of X coordinates
 * @param {Array} y - Array of Y coordinates
 * @param {Array} z - Array of Z coordinates
 */
export class MyTriangle extends CGFobject {
    constructor(scene, id, x, y, z) {
        super(scene);
        this.id = id;

        [this.x1, this.x2, this.x3] = x;
        [this.y1, this.y2, this.y3] = y;
        [this.z1, this.z2, this.z3] = z;

        this.v1_v2 = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        this.v2_v3 = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2));
        this.v3_v1 = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2));

        this.cosv1_v2 = (Math.pow(this.v1_v2, 2) - Math.pow(this.v2_v3, 2) + Math.pow(this.v3_v1, 2)) / (2 * this.v1_v2 * this.v3_v1);;
        this.sinv1_v2 = Math.sqrt(1 - Math.pow(this.cosv1_v2, 2));

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
    * Updates the list of texture coordinates of the triangle
    * @param {float} lenght_s - Horizontal texture length
    * @param {float} length_t - Vertical texture length
    */
    updateTexCoords(lenght_s, length_t) {
        this.texCoords = [
            0, 1,
            this.v1_v2 / lenght_s, 1,
            this.v3_v1 * this.cosv1_v2 / lenght_s, 1 - this.v3_v1 * this.sinv1_v2 / length_t,
        ];
        this.updateTexCoordsGLBuffers();
    }
}
