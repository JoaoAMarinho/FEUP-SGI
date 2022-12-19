import { CGFplane, CGFappearance } from "../../../lib/CGF.js";

export default class Tile {
    constructor(scene) {
        this.scene = scene;
        this.tile = new CGFplane(scene);

        this.whiteMaterial = new CGFappearance(scene);
        this.whiteMaterial.setAmbient(1, 1, 1, 1);
        this.whiteMaterial.setDiffuse(0.2, 0.7, 0.2, 1);
        this.whiteMaterial.setSpecular(0.0, 0.0, 0.0, 1);
        this.whiteMaterial.setShininess(120);

        this.blackMaterial = new CGFappearance(scene);
        this.blackMaterial.setAmbient(0, 0, 0, 1);
        this.blackMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
        this.blackMaterial.setSpecular(0.5, 0.0, 0.0, 1);
        this.blackMaterial.setShininess(120);
        
        this.highlightedMaterial = new CGFappearance(scene);
        this.highlightedMaterial.setAmbient(0.66, 0.89, 0.89, 1);
        this.highlightedMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
        this.highlightedMaterial.setSpecular(0.5, 0.0, 0.0, 1);
        this.highlightedMaterial.setShininess(500);
    }

    display(row, col, highlighted=false) {
        this.scene.translate(col, 0, row);

        if (highlighted) {
            this.highlightedMaterial.apply();
        } else if (((row + col) % 2) != 0) {
            this.blackMaterial.apply();
        } else {
            this.whiteMaterial.apply();
        }

        this.tile.display();
    }

}