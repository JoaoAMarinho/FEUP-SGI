import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addCameraControls() {
        var camerasFolder = this.gui.addFolder('Cameras');
        camerasFolder.add(this.scene, 'selectedCamera', this.scene.cameraIds).name('Camera').onChange(() => this.scene.updateCamera());
    }

    addLightsControls() {
        var lightsFolder = this.gui.addFolder('Lights');
        for (const light of this.scene.lights) {
            if (light.name == undefined) continue;

            lightsFolder.add(light, 'enabled').name(light.name).onChange(() => light.update());
        }
    }
}