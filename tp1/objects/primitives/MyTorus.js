import { CGFobject } from '../../../lib/CGF.js';

//TODO complete slices and loops
/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Object identifier
 * @param inner - The "tube" radius
 * @param outer - The circular axis radius
 * @param slices - 
 * @param loops - 
 */
export class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.id = id;

        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var phi = 0;
        var phiInc = (2 * Math.PI) / this.slices;

        var theta = 0;
        var thetaInc = (2 * Math.PI) / this.loops;

        for (var loop = 0; loop <= this.loops; loop++) {
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            phi = 0;
            for (var slice = 0; slice <= this.slices; slice++) {
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                //   x=(R+r·cos(v))cos(w)
                //   y=(R+r·cos(v))sin(w)
                //             z=r.sin(v)
                var x = (this.outer + (this.inner * cosTheta)) * cosPhi;
                var y = (this.outer + (this.inner * cosTheta)) * sinPhi
                var z = this.inner * sinTheta;
                var s = 1 - (loop / this.loops);
                var t = 1 - (slice / this.slices);

                this.vertices.push(x, y, z);
                this.normals.push(
                    cosPhi * cosTheta,
                    sinPhi * cosTheta,
                    sinTheta);
                this.texCoords.push(s, t);

                phi += phiInc;
            }

            theta += thetaInc;
        }

        for (var loop = 0; loop < this.loops; loop++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var first = (loop * (this.slices + 1)) + slice;
                var second = first + this.slices + 1;
    
                this.indices.push(first, second + 1, second);
                this.indices.push(first, first + 1, second + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
    * @method updateTexCoords
    * Updates the list of texture coordinates of the torus
    * @param {Array} coords - Array of texture coordinates
    */
    updateTexCoords(coords) {
    }
}
