import { CGFobject, CGFappearance } from '../../../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - Object identifier
 * @param baseRadius - Cylinder base radius 
 * @param topRadius - Cylinder top radius
 * @param slices - Rotation divisions
 * @param stacks - Height divisions
 */
export class MyCylinder extends CGFobject {
  constructor(scene, id, baseRadius, topRadius, height, slices, stacks) {
    super(scene);
    this.id = id;

    this.baseRadius = baseRadius;
    this.topRadius = topRadius;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang = 0;
    const alphaAng = 2 * Math.PI / this.slices;
    const increment = 1 / this.slices;

    const incrementHeight = this.height / this.stacks;
    const incrementRadius = (this.topRadius - this.baseRadius) / this.stacks;
    const verticesPerStack = 6 * this.slices;

    for (var i = 0; i < this.stacks; i++) {
      const baseHeight = incrementHeight * i;
      const topHeight = baseHeight + incrementHeight;
      const baseRadius = this.baseRadius + incrementRadius * i;
      const topRadius = baseRadius + incrementRadius;

      for (var ii = 0; ii < this.slices; ii++) {

        var sa = Math.sin(ang);
        var saa = Math.sin(ang + alphaAng);
        var ca = Math.cos(ang);
        var caa = Math.cos(ang + alphaAng);

        this.vertices.push(ca * baseRadius, sa * baseRadius, baseHeight);    //0
        this.vertices.push(caa * baseRadius, saa * baseRadius, baseHeight);  //1
        this.vertices.push(ca * topRadius, sa * topRadius, topHeight);       //2

        this.vertices.push(caa * baseRadius, saa * baseRadius, baseHeight);  //3
        this.vertices.push(caa * topRadius, saa * topRadius, topHeight);     //4
        this.vertices.push(ca * topRadius, sa * topRadius, topHeight);       //5

        const incrementIndice = verticesPerStack * i + 6 * ii;

        this.indices.push(incrementIndice, incrementIndice + 1, incrementIndice + 2);
        this.indices.push(incrementIndice + 3, incrementIndice + 4, incrementIndice + 5);

        this.normals.push(ca, sa, 0);    //0
        this.normals.push(caa, saa, 0);  //1
        this.normals.push(ca, sa, 0);    //2

        this.normals.push(caa, saa, 0);  //3
        this.normals.push(caa, saa, 0);  //4
        this.normals.push(ca, sa, 0);    //5

        this.texCoords.push(i * increment, 1);
        this.texCoords.push((i + 1) * increment, 1);
        this.texCoords.push(i * increment, 0);
        this.texCoords.push((i + 1) * increment, 1);
        this.texCoords.push((i + 1) * increment, 0);
        this.texCoords.push(i * increment, 0);
  
        ang += alphaAng;
      }
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}

