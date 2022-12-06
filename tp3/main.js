import { CGFapplication } from '../lib/CGF.js';
import { XMLscene } from './XMLscene.js';
import { MyInterface } from './MyInterface.js';
import GameController from './game/GameController.js';

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

function main() {

    // Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

    // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
    // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 

    var myGameController = new GameController(myScene);
    myScene.setGameController(myGameController);

    // start
    app.run();
}

main();
