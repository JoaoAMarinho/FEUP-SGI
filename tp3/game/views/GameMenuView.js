import { CGFappearance, CGFshader, CGFtexture } from "../../../lib/CGF.js";
import { MyRectangle } from "../../objects/primitives/MyRectangle.js";
import { MySphere } from "../../objects/primitives/MySphere.js";

const ICONS = Object.freeze({
  Home: "!",
  Camera: "-",
  Film: "_",
  Undo: ".",
  Checker: ",",
  Satellite: ";",
});

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
    this.setBackground();
  }

  setFontDict() {
    const letters = [
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    ];
    letters.push(ICONS.Home, ICONS.Camera, ICONS.Film, ICONS.Undo, ICONS.Checker, ICONS.Satellite, ":");
    this.fontDict = {};

    for (let i = 0; i < this.dims.rows; i++)
      for (let j = 0; j < this.dims.cols; j++)
        this.fontDict[letters[j + i * this.dims.cols]] = [j, i];
  }

  setBackground() {
    this.background = new MySphere(this.scene, '', 100, 60, 60);
    this.backgroundMaterial = new CGFappearance(this.scene);
    this.backgroundMaterial.setEmission(0.5, 0.5, 0.5, 1.0);
    this.backgroundMaterial.setAmbient(0.2, 0.25, 0.32, 1.0);
    this.backgroundMaterial.setDiffuse(0.2, 0.25, 0.32, 1.0);
    this.backgroundMaterial.setSpecular(0.2, 0.25, 0.32, 1.0);

    this.spaceTexture = new CGFtexture(this.scene, './scenes/images/stars.jpg');
    this.classicTexture = new CGFtexture(this.scene, './scenes/images/dark.jpg');
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
    const white = [1.0, 1.0, 1.0, 1.0];
    const purple = [0.29, 0.4, 69, 1.0];
    const purpleDisabled = [0.29, 0.4, 69, 0.7];

    let spaceColor = purple;
    let classicColor = purpleDisabled;
    let texture = this.spaceTexture;

    if (clickedMode == "Classic") {
      spaceColor = purpleDisabled;
      classicColor = purple;
      texture = this.classicTexture;
    }

    this.displayBackground(texture);
    this.setUpDisplay();

    this.pickId = 15;

    this.displayText("Checkers", [-19, 9, -50], [12, 12, 12], white);
    this.displayButton(["Play"], [-4, 0, -50], [6, 6, 6], purple);

    this.displayButton(["Space"], [-14, -8, -50], [4, 4, 4], spaceColor);
    this.displayText(ICONS.Satellite, [-15, -8, -50], [6, 6, 6]);

    this.displayButton(["Classic"], [6, -8, -50], [4, 4, 4], classicColor);
    this.displayText(ICONS.Checker, [16.5, -7.5, -50], [4, 4, 4]);

    this.resetDisplay();
  }

  displayGameMenu() {
    this.setUpDisplay();

    this.pickId = 15;
    this.displayButton([ICONS.Camera, "Camera"], [-36, 19, -50], [4, 4, 4]);

    this.resetDisplay();
  }

  displayBackground(texture) {
    this.scene.pushMatrix();

    this.scene.scale(-1, -1, -1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);

    this.backgroundMaterial.setTexture(texture);
    this.backgroundMaterial.apply();
    this.background.display();

    this.scene.popMatrix();
  }

  displayButton(text, position, scale, displayColor) {
    const button = text.length > 1 ? text[1] : text[0];

    this.scene.registerForPick(this.pickId++, { button });
    this.displayText(text[0], position, scale, displayColor);
  }

  displayText(text, position, scale, displayColor=null) {
    this.scene.pushMatrix();
    this.scene.translate(...position);

    for (let i = 0; i < text.length; i++) {
      const charCoords = this.getFontPosition(text[i]);
      if (displayColor == null)
        this.scene.activeShader.setUniformsValues({ charCoords, keepColor: true });
      else 
        this.scene.activeShader.setUniformsValues({ charCoords, displayColor, keepColor: false });

      this.scene.pushMatrix();

      this.scene.scale(...scale);
      this.scene.translate(i*0.5, 0, 0);
      this.rect.display();

      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }
}
