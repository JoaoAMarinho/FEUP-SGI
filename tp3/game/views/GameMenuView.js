import { CGFappearance, CGFshader, CGFtexture } from "../../../lib/CGF.js";
import { MyRectangle } from "../../objects/primitives/MyRectangle.js";

export default class GameMenuView {
  constructor(scene) {
    this.scene = scene;
    this.appearance = new CGFappearance(this.scene);

    const texture = new CGFtexture(this.scene, "./textures/font.png");
    this.appearance.setTexture(texture);
    this.textShader = new CGFshader(
      this.scene.gl,
      "./shaders/font.vert",
      "./shaders/font.frag"
    );

    this.dims = { rows: 3, cols: 23 };
    this.textShader.setUniformsValues({
      dims: [this.dims.cols, this.dims.rows],
    });

    this.rect = new MyRectangle(this.scene, '', [-0.5, 0.5], [-0.5, 0.5]);

    this.setFontDict();
  }

  setFontDict() {
    const letters = [
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    ];
    letters.push("home", "camera", "film", "undo", "checker", "satellite", ":");
    this.fontDict = {};

    for (let i = 0; i < this.dims.rows; i++)
      for (let j = 0; j < this.dims.cols; j++)
        this.fontDict[letters[j + i * this.dims.cols]] = [j, i];
  }

  getFontPosition(letter) {
    return this.fontDict[letter];
  }

  setUpDisplay() {
    this.scene.setActiveShaderSimple(this.textShader);
    this.scene.gl.disable(this.scene.gl.DEPTH_TEST);
    this.appearance.apply();
    this.scene.loadIdentity();
  }

  resetDisplay() {
    this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
    this.scene.setActiveShaderSimple(this.scene.defaultShader);
    this.scene.clearPickRegistration();
  }

  displayMainMenu(clickedMode) {
    this.setUpDisplay();

    let pickId = 10;
    this.displayText("Space", [-1, 0, -50], [1, 1, 1], pickId++);

    this.resetDisplay();
  }

  displayGameMenu() {
    this.setUpDisplay();

    this.resetDisplay();
  }

  displayText(text, position, scale, pickId) {
    this.scene.pushMatrix();
    this.scene.translate(...position);
    this.scene.registerForPick(pickId, { text });

    for (let i = 0; i < text.length; i++) {
      const charCoords = this.getFontPosition(text[i]);
      this.scene.activeShader.setUniformsValues({ charCoords });

      this.scene.pushMatrix();

      this.scene.translate(i, 0, 0);
      this.scene.scale(...scale);
      this.rect.display();

      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }
}
