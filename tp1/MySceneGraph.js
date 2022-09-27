import { CGFXMLreader } from '../lib/CGF.js';
import { MyRectangle } from './objects/primitives/MyRectangle.js';
import { MyTriangle } from './objects/primitives/MyTriangle.js';
import { MyCylinder } from './objects/primitives/MyCylinder.js';
import { MySphere } from './objects/primitives/MySphere.js';
import { MyTorus } from './objects/primitives/MyTorus.js';
import { MyNode } from './objects/MyNode.js';

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.rootNode = null;

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            this.parseAmbient(nodes[index]);
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            this.parseLights(nodes[index]);
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            this.parseMaterials(nodes[index]);
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            this.parseTransformations(nodes[index]);
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.onXMLMinorError("To do: Parse views and create cameras.");
        //TODO Parse views and create cameras.
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (color === null)
            return;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (color === null)
            return;
        else
            this.background = color;

        this.log("Parsed ambient");
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) {
                this.onXMLError("no ID defined for light");
                continue;
            }

            // Checks for repeated IDs.
            if (this.lights[lightId] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + lightId + ")");
                continue;
            }

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    //REVIEW continue
                    if (aux === null)
                        continue;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (aux === null)
                        return;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            this.onXMLError("at least one light must be defined");
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        this.onXMLMinorError("To do: Parse textures.");
        //TODO Parse textures.
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = {};

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) {
                this.onXMLError("no ID defined for material");
                continue;
            }

            // Checks for repeated IDs.
            if (this.materials[materialID] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + materialID + ")");
                continue;
            }

            var materialShininess = this.reader.getFloat(children[i], 'shininess');
            if (materialShininess == null) {
                this.onXMLMinorError("no shininess attribute defined for material (conflict: ID = " + materialID + ")");
                continue;
            }

            // Checks for material attributes' errors.
            var material = {};
            if (this.parseMaterial(children[i].children, materialID, material) === null)
                continue;

            material.shininess = materialShininess; 
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
    }

    /**
     * Parse a <material> block.
     * @param {block element} nodes
     * @param {string} materialID 
     * @param {}
     */
    parseMaterial(nodes, materialID, material) {
        var nodeNames = [];
        const attributeNames = ["ambient", "diffuse", "specular", "emission"];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        for (var i = 0; i < attributeNames.length; i++) {
            var attributeIndex = nodeNames.indexOf(attributeNames[i]);

            if (attributeIndex != -1) {
                var color = this.parseColor(nodes[attributeIndex]);

                if (color === null)
                    return null;

                material[attributeNames[i]] = color;
            }
            else {
                this.onXMLMinorError("material " + attributeNames[i] + " undefined for ID = " + materialID);
                return null;
            }
        }
    }

    parseComponentMaterials(nodes, componentID) {

    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = {};

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null) {
                this.onXMLMinorError("no ID defined for transformation");
                continue;
            }

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null) {
                this.onXMLMinorError("ID must be unique for each transformation (conflict: ID = " + transformationID + ")");
                continue;
            }

            // Specifications for the current transformation.
            grandChildren = children[i].children;
            var transfMatrix = this.parseTransformation(grandChildren, transformationID);

            if (transfMatrix === null)
                continue;

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
    }

    parseTransformation(nodes, transformationID) {
        var transfMatrix = mat4.create();

        for (var j = 0; j < nodes.length; j++) {
            switch (nodes[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(nodes[j], "translate transformation for ID " + transformationID);
                    if (coordinates === null)
                        return null;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(nodes[j], "scale transformation for ID " + transformationID);
                    if (coordinates === null)
                        return null;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'rotate':
                    var axis, angle;
                    var rotationParameters = this.parseRotationParameters(nodes[j], "scale transformation for ID " + transformationID);
                    if (rotationParameters === null)
                        return null;

                    [axis, angle] = rotationParameters;
                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, axis);
                    break;
            }
        }
        return transfMatrix;
    }

    parseComponentTransformations(nodes, componentID) {
        if (nodes.length === 0) {
            this.onXMLMinorError("There must be one or more transformation tag (transformationref or explicit transformation) (conflictt: ID = " + componentID + ")");
            return null;
        }

        if (nodes.length === 1) {
            const nodeName = nodes[0].nodeName;
            const id = this.reader.getString(nodes[0], 'id');
            if (nodeName !== "transformationref") {
                this.onXMLMinorError("Wrong tag for unique transformation (conflictt: ID = " + componentID + ")");
                return null;
            }

            return this.transformations[id];
        }

        if (nodes.length === 3) {
            return this.parseTransformation(nodes, "of component " + componentID);
        }

        this.onXMLMinorError("Invalid transformation block (conflictt: ID = " + componentID + ")");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = {};

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;
            var error;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                if ((error = this.parseRectangle(grandChildren[0], primitiveId)) !== null)
                    return error;
            }
            else if (primitiveType == 'triangle') {
                if ((error = this.parseTriangle(grandChildren[0], primitiveId)) != null)
                    return error;
            }
            else if (primitiveType == 'cylinder') {
                if ((error = this.parseCylinder(grandChildren[0], primitiveId)) != null)
                    return error;
            }
            else if (primitiveType == 'sphere') {
                if ((error = this.parseSphere(grandChildren[0], primitiveId)) != null)
                    return error;
            }
            else if (primitiveType == 'torus') {
                if ((error = this.parseTorus(grandChildren[0], primitiveId)) != null)
                    return error;
            }
            else {
                return "non existing primitive '" + primitiveType + "'";
            }
        }

        this.log("Parsed primitives");
        return null;
    }


    /**
     * Parses a <rectangle> block.
     * @param {rectangle block element} rectangle 
     * @param {primitive id} primitiveId 

     */
    parseRectangle(rectangle, primitiveId) {
        // x1
        var x1 = this.reader.getFloat(rectangle, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(rectangle, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(rectangle, 'x2');
        if (!(x2 != null && !isNaN(x2) && x2 > x1))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(rectangle, 'y2');
        if (!(y2 != null && !isNaN(y2) && y2 > y1))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        var rectangle = new MyRectangle(this.scene, primitiveId, [x1, x2], [y1, y2]);
        this.primitives[primitiveId] = rectangle;

        return null;
    }

    /**
     * Parses a <triangle> block.
     * @param {triangle block element} triangle 
     * @param {primitive id} primitiveId 
     */
    parseTriangle(triangle, primitiveId) {
        // x1, y1, z1
        var x1 = this.reader.getFloat(triangle, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

        var y1 = this.reader.getFloat(triangle, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

        var z1 = this.reader.getFloat(triangle, 'z1');
        if (!(z1 != null && !isNaN(z1)))
            return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

        // x2, y2, z2
        var x2 = this.reader.getFloat(triangle, 'x2');
        if (!(x2 != null && !isNaN(x2)))
            return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

        var y2 = this.reader.getFloat(triangle, 'y2');
        if (!(y2 != null && !isNaN(y2)))
            return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

        var z2 = this.reader.getFloat(triangle, 'z2');
        if (!(z2 != null && !isNaN(z2)))
            return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

        // x3, y3, z3
        var x3 = this.reader.getFloat(triangle, 'x3');
        if (!(x3 != null && !isNaN(x3)))
            return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

        var y3 = this.reader.getFloat(triangle, 'y3');
        if (!(y3 != null && !isNaN(y3)))
            return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

        var z3 = this.reader.getFloat(triangle, 'z3');
        if (!(z3 != null && !isNaN(z3)))
            return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

        var triangle = new MyTriangle(this.scene, primitiveId, [x1, x2, x3], [y1, y2, y3], [z1, z2, z3]);
        this.primitives[primitiveId] = triangle;

        return null;
    }

    /**
     * Parses a <cylinder> block.
     * @param {cylinder block element} cylinder 
     * @param {primitive id} primitiveId 
     */
    parseCylinder(cylinder, primitiveId) {
        // base
        var base = this.reader.getFloat(cylinder, 'base');
        if (!(base != null && !isNaN(base)))
            return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(cylinder, 'top');
        if (!(top != null && !isNaN(top)))
            return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(cylinder, 'height');
        if (!(height != null && !isNaN(height)))
            return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(cylinder, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(cylinder, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
        this.primitives[primitiveId] = cylinder;

        return null;
    }

    /**
     * Parses a <sphere> block.
     * @param {sphere block element} sphere 
     * @param {primitive id} primitiveId 
     */
    parseSphere(sphere, primitiveId) {
        // radius
        var radius = this.reader.getFloat(sphere, 'radius');
        if (!(radius != null && !isNaN(radius)))
            return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(sphere, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(sphere, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

        //TODO: definir primitiva
        var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);
        this.primitives[primitiveId] = sphere;
        return null;
    }


    /**
     * Parses a <torus> block.
     * @param {torus block element} sphere 
     * @param {primitive id} primitiveId 
     */
    parseTorus(torus, primitiveId) {
        // inner
        var inner = this.reader.getFloat(torus, 'inner');
        if (!(inner != null && !isNaN(inner)))
            return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

        // outer
        var outer = this.reader.getFloat(torus, 'outer');
        if (!(outer != null && !isNaN(outer)))
            return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(torus, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

        // loops
        var loops = this.reader.getInteger(torus, 'loops');
        if (!(loops != null && !isNaN(loops)))
            return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

        var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
        this.primitives[primitiveId] = torus;
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = {};

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            const component = new MyNode(this.scene, componentID);

            //TODO Parse components.
            // Transformations
            var transformation;
            if ((transformation = this.parseComponentTransformations(grandChildren[transformationIndex].children, componentID)) !== null)
                component.setTransformation(transformation);

            // Materials
            var materials = this.parseComponentMaterials(grandChildren[materialsIndex].children, componentID);
            
            // Texture

            // Children
            grandgrandChildren = grandChildren[childrenIndex].children;

            if (grandgrandChildren.length == 0) {
                this.onXMLMinorError("There must be one or more component tag (componentref or primitiveref) (conflict: ID = " + componentID + ")");
                continue;
            }

            var child;
            for (var j = 0; j < grandgrandChildren.length; j++) {
                child = this.parseChild(grandgrandChildren[j], componentID);

                if (child.node === null)
                    continue;

                child.isPrimitive ? component.addPrimitive(child.node) : component.addComponent(child.node);
            }

            if (this.rootNode === null && componentID === this.idRoot) {
                this.rootNode = component;
                continue;
            }

            this.components[componentID] = component;
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x))) {
            this.onXMLMinorError("unable to parse x-coordinate of the " + messageError);
            return null;
        }

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y))) {
            this.onXMLMinorError("unable to parse y-coordinate of the " + messageError);
            return null;
        }

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z))) {
            this.onXMLMinorError("unable to parse z-coordinate of the " + messageError);
            return null;
        }

        position.push(...[x, y, z]);
        return position;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (position === null)
            return null;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w))) {
            this.onXMLMinorError("unable to parse w-coordinate of the " + messageError);
            return null;
        }

        position.push(w);
        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseRotationParameters(node, messageError) {
        var parameters = [];

        // axis
        var axis = this.reader.getString(node, 'axis');
        axis = this.axisCoords[axis];
        if (!(axis != null)) {
            this.onXMLMinorError("unable to parse axis of the " + messageError);
            return null;
        }

        // angle
        var angle = this.reader.getFloat(node, 'angle');
        if (!(angle != null && !isNaN(angle))) {
            this.onXMLMinorError("unable to parse the angle of the " + messageError);
            return null;
        }

        parameters.push(...[axis, angle * Math.PI / 180]);
        return parameters;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)) {
            this.onXMLMinorError("unable to parse R component of the " + messageError);
            return null;
        }

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
            this.onXMLMinorError("unable to parse G component of the " + messageError);
            return null;
        }

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
            this.onXMLMinorError("unable to parse B component of the " + messageError);
            return null;
        }

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
            this.onXMLMinorError("unable to parse A component of the " + messageError);
            return null;
        }

        color.push(...[r, g, b, a]);
        return color;
    }

    parseChild(node, componentID) {
        const nodeName = node.nodeName;
        const id = this.reader.getString(node, 'id');

        var child = {
            node: null,
            isPrimitive: true,
        };

        if (nodeName === "componentref") {
            child.node = this.components[id];
            child.isPrimitive = false;
        }
        else if (nodeName === "primitiveref") {
            child.node = this.primitives[id];
        }

        child.node === null ?
            this.onXMLMinorError("unknown tag <" + nodeName + "> (conflict: ID = " + componentID + ")") : child.node = child.node.id;

        return child;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To test the parsing/creation of the primitives, call the display function directly
        if (this.rootNode !== null)
            this.processNode(this.rootNode);
    }

    processNode(node) {

        this.scene.pushMatrix();
        
        // Apply transformations
        if (node.transformation !== null)
            this.scene.multMatrix(node.transformation);

        for(var i = 0; i < node.primitives.length; i++) {
            this.primitives[node.primitives[i]].display();
        }
        for(var i = 0; i < node.components.length; i++) {
            this.processNode(this.components[node.components[i]]);
        }

        this.scene.popMatrix();
    }
}