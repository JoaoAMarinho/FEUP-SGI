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

		for (let slice = 0; slice <= this.slices; ++slice) {
			const v = slice / this.slices;
			const slice_angle = v * 2 * Math.PI;
			const cos_slices = Math.cos(slice_angle);
			const sin_slices = Math.sin(slice_angle);
			const slice_rad = this.outer + this.inner * cos_slices;

			for (let loop = 0; loop <= this.loops; ++loop) {
				//   x=(R+r·cos(v))cos(w)
				//   y=(R+r·cos(v))sin(w)
				//             z=r.sin(v)
				const u = loop / this.loops;
				const loop_angle = u * 2 * Math.PI;
				const cos_loops = Math.cos(loop_angle);
				const sin_loops = Math.sin(loop_angle);

				const x = slice_rad * cos_loops;
				const y = slice_rad * sin_loops;
				const z = this.inner * sin_slices;

				this.vertices.push(x, y, z);
				this.normals.push(
					cos_loops * sin_slices,
					sin_loops * sin_slices,
					cos_slices);

				this.texCoords.push(u);
				this.texCoords.push(v);
			}
		}

		const vertsPerSlice = this.loops + 1;
		for (let i = 0; i < this.slices; ++i) {
			let v1 = i * vertsPerSlice;
			let v2 = v1 + vertsPerSlice;

			for (let j = 0; j < this.loops; ++j) {

				this.indices.push(v1);
				this.indices.push(v1 + 1);
				this.indices.push(v2);

				this.indices.push(v2);
				this.indices.push(v1 + 1);
				this.indices.push(v2 + 1);

				v1 += 1;
				v2 += 1;
			}
		}

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}
}

