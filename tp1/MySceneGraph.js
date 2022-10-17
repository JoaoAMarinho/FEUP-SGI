import { CGFappearance, CGFcamera, CGFcameraOrtho, CGFtexture, CGFXMLreader } from '../lib/CGF.js';
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

        this.idRoot = null;                   // The id of the root element.

        this.views = {};                     // CGFcamera or CGFcameraOrtho dictionary.
        this.lights = {};
        this.textures = {};                   // CGFtexture dictionary.
        this.materials = {};                  // CGFappearance dictionary.
        this.transformations = {};            // Mat4 transformation dictionary.
        this.primitives = {};                 // CFGObject dictionary.
        this.components = {};                 // MyNode dictionary.

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

        // Remove graph cycles
        this.isAcyclic(this.rootNode);

        // Remove undefined child components
        this.validateGraphComponents(this.rootNode);

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
        if (index != SCENE_INDEX)
            this.onXMLMinorError("tag <scene> out of order " + index);

        //Parse scene block
        if ((error = this.parseScene(nodes[index])) != null)
            return error;

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        if (index != VIEWS_INDEX)
            this.onXMLMinorError("tag <views> out of order");

        //Parse views block
        if ((error = this.parseViews(nodes[index])) != null)
            return error;

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        if (index != AMBIENT_INDEX)
            this.onXMLMinorError("tag <ambient> out of order");

        //Parse ambient block
        if ((error = this.parseAmbient(nodes[index])) != null)
            return error;

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        if (index != LIGHTS_INDEX)
            this.onXMLMinorError("tag <lights> out of order");

        //Parse lights block
        if ((error = this.parseLights(nodes[index])) != null)
            return error;

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";

        if (index != TEXTURES_INDEX)
            this.onXMLMinorError("tag <textures> out of order");

        //Parse textures block
        if ((error = this.parseTextures(nodes[index])) != null)
            return error;

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        if (index != MATERIALS_INDEX)
            this.onXMLMinorError("tag <materials> out of order");

        //Parse materials block
        if ((error = this.parseMaterials(nodes[index])) != null)
            return error;

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        if (index != TRANSFORMATIONS_INDEX)
            this.onXMLMinorError("tag <transformations> out of order");

        //Parse transformations block
        if ((error = this.parseTransformations(nodes[index])) != null)
            return error;

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        if (index != PRIMITIVES_INDEX)
            this.onXMLMinorError("tag <primitives> out of order");

        //Parse primitives block
        if ((error = this.parsePrimitives(nodes[index])) != null)
            return error;

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        if (index != COMPONENTS_INDEX)
            this.onXMLMinorError("tag <components> out of order");

        //Parse components block
        if ((error = this.parseComponents(nodes[index])) != null)
            return error;

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
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        var defaultCamera = this.reader.getString(viewsNode, 'default')
        if (defaultCamera == null) {
            this.onXMLMinorError("no default camera id defined for views")
            return null;        
        }
        
        var children = viewsNode.children;
        var grandChildren;
        var child = null;
        var nodeNames;

        for (var i = 0; i < children.length; i++) {
            var id, near, far, angle, left, right, top, bottom;
            var from, to , up;
            
            child = children[i];
            grandChildren = child.children;

            nodeNames = [];
            for (var i = 0; i < child.children.length; i++) {
                nodeNames.push(grandChildren[i].nodeName);
            }

            id = this.reader.getString(child, 'id');
            if (id == null) {
                this.onXMLMinorError("no ID defined for view");
                continue;
            }

            if (nodeNames.length == 0 || nodeNames.length > 3) {
                this.onXMLMinorError("view must have 2 or 3 child nodes (conflict: ID = " + id + ")");
                continue;
            }

            from = nodeNames.indexOf("from");
            to = nodeNames.indexOf("to");
            up = nodeNames.indexOf("up");

            if (from == -1) {
                this.onXMLMinorError("node <from> must be defined in view (conflict: ID = " + id + ")");
                continue;     
            }
            if (to == -1) {
                this.onXMLMinorError("node <to> must be defined in view (conflict: ID = " + id + ")");
                continue;     
            }
             
            from = this.parseCoordinates3D(grandChildren[from], "attribute 'from' in view (conflict: ID = " + id + ")");
            if (!Array.isArray(from)) {
                this.onXMLMinorError(from);
                continue;
            }
            
            to = this.parseCoordinates3D(grandChildren[to], "attribute 'to' in view (conflict: ID = " + id + ")");
            if (!Array.isArray(to)) {
                this.onXMLMinorError(to);
                continue;
            }

            near = this.reader.getFloat(child, 'near');
            if (near == null) {
                this.onXMLMinorError("no near attribute defined for view (conflict: ID = " + id + ")");
                continue;
            }

            far = this.reader.getFloat(child, 'far');
            if (far == null) {
                this.onXMLMinorError("no far attribute defined for view (conflict: ID = " + id + ")");
                continue;
            }
            
            if (child.nodeName == "perspective") {
                angle = this.reader.getFloat(child, 'angle');
                if (angle == null) {
                    this.onXMLMinorError("no angle attribute defined for view (conflict: ID = " + id + ")");
                    continue;
                }

                if (up != -1) {
                    this.onXMLMinorError("up attribute wrongly defined for perspective view (conflict: ID = " + id + ")");
                    continue;             
                }
                this.views[id] = new CGFcamera(angle * DEGREE_TO_RAD, near, far, from, to);

            } else if (child.nodeName == "ortho") {
                left = this.reader.getFloat(child, 'left');
                if (left == null) {
                    this.onXMLMinorError("no left attribute for view (conflict: ID = " + id + ")");
                    continue;
                }
                
                right = this.reader.getFloat(child, 'right');
                if (right == null) {
                    this.onXMLMinorError("no right attribute defined for view (conflict: ID = " + id + ")");
                    continue;
                }
                
                top = this.reader.getFloat(child, 'top');
                if (top == null) {
                    this.onXMLMinorError("no top attribute defined for view (conflict: ID = " + id + ")");
                    continue;
                }
                
                bottom = this.reader.getFloat(child, 'bottom');
                if (bottom == null) {
                    this.onXMLMinorError("no bottom attribute defined for view (conflict: ID = " + id + ")");
                    continue;
                }

                up = up == -1 ? [0, 1, 0] : 
                                this.parseCoordinates3D(grandChildren[up], "attribute 'up' in view (conflict: ID = " + id + ")");
                
                this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
            } else {
                this.onXMLMinorError("unknown camera type '" + child.nodeName + "' (conflict: ID = " + id + ")");
                continue;
            }
        }

        if (Object.keys(this.views).length == 0)
            this.onXMLMinorError("there must exist at least one view (ortho or perspective)")
        else if (this.views[defaultCamera] == null)
            this.onXMLMinorError("missing default camera in <views> (ID = " + defaultCamera + ")")
        else {
            this.camera = this.views[defaultCamera];
        }

        this.log("Parsed views");
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
        if (!Array.isArray(color))
            return color;
        this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        this.background = color;

        this.log("Parsed ambient");
        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

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
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
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
                var attributeType;

                if (attributeIndex != -1) {
                    if ((attributeType = attributeTypes[j]) == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeType == "attenuation") 
                        var aux = this.parseAttenuation(grandChildren[attributeIndex], "light attenuation for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;
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
                    if (!Array.isArray(aux))
                        return aux;

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
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) {
                this.onXMLError("no ID defined for texture");
                continue;
            }

            if (this.textures[textureID] != null) {
                this.onXMLMinorError("ID must be unique for each texture (conflict: ID = " + textureID + ")");
                continue;
            }

            // Parse texture
            var file = this.reader.getString(children[i], 'file');

            if (!file.endsWith('.jpg') && !file.endsWith('.png')) {
                this.onXMLMinorError("File must be of type .jpg or .png (conflict: ID = " + textureID + ")");
                continue;
            }

            if (!this.fileExists(file)) {
                this.onXMLMinorError("File " + file + " does no exist (conflict: ID = " + textureID + ")");
                continue;
            }

            this.textures[textureID] = new CGFtexture(this.scene, file);
        }

        this.log("Parsed textures");
        return null;
    }


    parseComponentTexture(node, componentID) {
        var textureID = this.reader.getString(node, 'id');
        var length_s = this.reader.getFloat(node, 'length_s');
        var length_t = this.reader.getFloat(node, 'length_t');

        if (textureID == 'inherit' || textureID == 'none') {
            if (length_s != 1.0 || length_t != 1.0) {
                this.onXMLMinorError("invalid texture values (lenght_s or length_t != 1.0) (conflict: ID = " + componentID + ")");
                return null;
            }

            return { id: textureID, length_s, length_t };
        }
        if (length_s == null || length_t == null || this.textures[textureID] == null) {
            this.onXMLMinorError("invalid texture tag definition (conflict: ID = " + componentID + ")");
            return null;
        }

        return { id: textureID, length_s, length_t };
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var material;
        var appearence;

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
                this.onXMLMinorError("ID must be unique for each material (conflict: ID = " + materialID + ")");
                continue;
            }

            var materialShininess = this.reader.getFloat(children[i], 'shininess');
            if (materialShininess == null) {
                this.onXMLMinorError("no shininess attribute defined for material (conflict: ID = " + materialID + ")");
                continue;
            }

            // Checks for material attributes' errors.
            if ((material = this.parseMaterial(children[i].children, materialID)) == null)
                continue;

            appearence = new CGFappearance(this.scene);
            appearence.setAmbient(...material.ambient);
            appearence.setDiffuse(...material.diffuse);
            appearence.setSpecular(...material.specular);
            appearence.setEmission(...material.emission);
            appearence.setShininess(materialShininess);

            this.materials[materialID] = appearence;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parse a <material> block.
     * @param {block element} nodes
     * @param {string} materialID 
     * @param {}
     */
    parseMaterial(nodes, materialID) {
        var nodeNames = [];
        var material = {};
        var error = null;
        const attributeNames = ["ambient", "diffuse", "specular", "emission"];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        for (var i = 0; i < attributeNames.length; i++) {
            var attributeIndex = nodeNames.indexOf(attributeNames[i]);

            if (attributeIndex == -1) {
                error = "material " + attributeNames[i] + " component undefined for ID = " + materialID;
                break;
            }

            var color = this.parseColor(nodes[attributeIndex]);
            if (!Array.isArray(color)) {
                error = color;
                break;
            }

            material[attributeNames[i]] = color;
        }

        if (error != null) {
            this.onXMLMinorError(error);
            return null;
        }

        return material;
    }

    parseComponentMaterials(nodes, componentID) {
        if (nodes.length === 0)
            return "There must be one or more material tag (conflict: ID = " + componentID + ")";

        var materials = [];
        var materialID;

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName != 'material') {
                this.onXMLMinorError("unknown tag <" + nodes[i].nodeName + "> in component materials block (conflict: ID = " + componentID + ")");
                continue;
            }

            materialID = this.reader.getString(nodes[i], 'id');
            if (materialID == 'inherit' || this.materials[materialID] != null)
                materials.push(materialID);
        }

        return materials.length == 0 ? "Material blocks badly defined in component (conflict: ID = " + componentID + ")" : materials;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        var transfMatrix;
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

            if ((transfMatrix = this.parseTransformation(grandChildren, transformationID)) == null)
                continue;

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    parseTransformation(nodes, transformationID) {
        var transfMatrix = mat4.create();
        var error = null;
        var values;

        for (var j = 0; j < nodes.length; j++) {
            if (nodes[j].nodeName == 'translate') {
                values = this.parseCoordinates3D(nodes[j], "translate transformation for ID " + transformationID);
                if (!Array.isArray(values)) {
                    error = values;
                    break;
                }

                transfMatrix = mat4.translate(transfMatrix, transfMatrix, values);
            } else if (nodes[j].nodeName == 'scale') {
                var values = this.parseCoordinates3D(nodes[j], "scale transformation for ID " + transformationID);
                if (!Array.isArray(values)) {
                    error = values;
                    break;
                }

                transfMatrix = mat4.scale(transfMatrix, transfMatrix, values);
            } else if (nodes[j].nodeName == 'rotate') {
                var axis, angle;
                var values = this.parseRotationParameters(nodes[j], "scale transformation for ID " + transformationID);
                if (!Array.isArray(values)) {
                    error = values;
                    break;
                }

                [axis, angle] = values;
                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle, axis);
            } else
                error = "invalid tag name in transformation for ID " + transformationID;
        }

        if (error == null)
            return transfMatrix;

        this.onXMLMinorError(error);
        return null;
    }

    parseComponentTransformations(nodes, componentID) {
        if (nodes.length == 1) {
            const nodeName = nodes[0].nodeName;
            if (nodeName == "transformationref") {
                const id = this.reader.getString(nodes[0], 'id');
                return this.transformations[id] != null ? { isExplicit: false, matrix: id } : null;
            }
        }

        var matrix = this.parseTransformation(nodes, "of component " + componentID);

        return matrix != null ? { isExplicit: true, matrix } : null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null) {
                this.onXMLMinorError("no ID defined for primitive");
                continue;
            }

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null) {
                this.onXMLMinorError("ID must be unique for each primitive (conflict: ID = " + primitiveId + ")");
                continue;
            }

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                this.onXMLMinorError("There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)");
                continue;
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;
            var error = null;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                error = this.parseRectangle(grandChildren[0], primitiveId);
            }
            else if (primitiveType == 'triangle') {
                error = this.parseTriangle(grandChildren[0], primitiveId);
            }
            else if (primitiveType == 'cylinder') {
                error = this.parseCylinder(grandChildren[0], primitiveId);
            }
            else if (primitiveType == 'sphere') {
                error = this.parseSphere(grandChildren[0], primitiveId);
            }
            else if (primitiveType == 'torus') {
                error = this.parseTorus(grandChildren[0], primitiveId);
            }
            else {
                error = "non existing primitive '" + primitiveType + "'";
            }

            if (error != null) {
                this.onXMLMinorError(error);
                continue;
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

        this.primitives[primitiveId] = new MyRectangle(this.scene, primitiveId, [x1, x2], [y1, y2]);
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

        this.primitives[primitiveId] = new MyTriangle(this.scene, primitiveId, [x1, x2, x3], [y1, y2, y3], [z1, z2, z3]);
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

        this.primitives[primitiveId] = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
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

        this.primitives[primitiveId] = new MySphere(this.scene, primitiveId, radius, slices, stacks);
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
        //TODO review torus normals
        this.primitives[primitiveId] = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

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
            if (componentID == null) {
                this.onXMLMinorError("no ID defined for componentID");
                continue;
            }

            // Checks for repeated IDs.
            if (this.components[componentID] != null) {
                this.onXMLMinorError("ID must be unique for each component (conflict: ID = " + componentID + ")");
                continue;
            }

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            if ([transformationIndex, materialsIndex, textureIndex, childrenIndex].some((i) => i == -1)) {
                this.onXMLMinorError("missing mandatory block in component (conflict: ID = " + componentID + ")");
                continue;
            }

            const component = new MyNode(this.scene, componentID);

            // Transformations
            var transformation;
            grandgrandChildren = grandChildren[transformationIndex].children;

            if (grandgrandChildren.length !== 0) {
                if ((transformation = this.parseComponentTransformations(grandgrandChildren, componentID)) == null)
                    continue;

                component.setTransformation(transformation);
            }

            // Materials
            var materials = this.parseComponentMaterials(grandChildren[materialsIndex].children, componentID);
            if (!Array.isArray(materials)) {
                this.onXMLMinorError(materials);
                continue;
            }
            component.setMaterials(materials);

            // Texture
            var texture;
            if ((texture = this.parseComponentTexture(grandChildren[textureIndex], componentID)) == null)
                continue;
            component.setTexture(texture);

            // Children
            grandgrandChildren = grandChildren[childrenIndex].children;

            if (grandgrandChildren.length == 0) {
                this.onXMLMinorError("There must be one or more component tag (componentref or primitiveref) (conflict: ID = " + componentID + ")");
                continue;
            }

            var child;
            for (var j = 0; j < grandgrandChildren.length; j++) {
                child = this.parseChild(grandgrandChildren[j], componentID);

                if (child.node == null)
                    continue;

                child.isPrimitive ? component.addPrimitive(child.node) : component.addComponent(child.node);
            }

            if (this.rootNode == null && componentID == this.idRoot) {
                if (component.texture.id == 'inherit')
                    return "root component must not 'inherit' texture (conflict: ID = " + componentID + ")";

                if (component.materials.some((x) => x == 'inherit'))
                    return "root component must not 'inherit' material (conflict: ID = " + componentID + ")";

                this.rootNode = component;
                continue;
            }

            this.components[componentID] = component;
        }

        this.log("Parsed components");
        return null;
    }

    parseChild(node, componentID) {
        const nodeName = node.nodeName;
        const id = this.reader.getString(node, 'id');

        var child = {
            node: null,
            isPrimitive: true,
        };

        if (nodeName == "componentref") {
            child.node = id;
            child.isPrimitive = false;
        }
        else if (nodeName == "primitiveref") {
            if (this.primitives[id] != null)
                child.node = id;
            else
                this.onXMLMinorError("unknown primitive with id '" + id + "' (conflict: ID = " + componentID + ")");
        }
        else {
            this.onXMLMinorError("unknown tag <" + nodeName + "> (conflict: ID = " + componentID + ")");
        }

        return child;
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
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

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

        if (!Array.isArray(position))
            return position;

        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

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
        if (!(axis != null))
            return "unable to parse axis of the " + messageError;

        // angle
        var angle = this.reader.getFloat(node, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse the angle of the " + messageError;

        parameters.push(...[axis, angle * DEGREE_TO_RAD]);
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
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }


    parseAttenuation(node, messageError) {
        // constant
        var constant = this.reader.getFloat(node, 'constant');
        console.log(!(constant != "null" && !isNaN(constant)));
        if (!(constant != "null" && !isNaN(constant)) && (constant != 0 && constant != 1.0))
            return "unable to parse constant component of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear)) && (linear != 0.0 && linear != 1.0))
            return "unable to parse linear component of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic)) && (quadratic != 0.0 && quadratic != 1.0))
            return "unable to parse quadratic component of the " + messageError;

        if ((constant + linear + quadratic) != 1.0) 
            return "light attenuation component must only one of constant, linear or quadratic with value 1.0"

        return [constant, linear, quadratic];
    }

    validateGraphComponents(node) {
        var index = node.components.length;
        var component;

        while (index--) {
            if ((component = this.components[node.components[index]]) == null) {
                this.onXMLMinorError("child component '" + node.components[index] + "' is not defined. (conflict: ID = " + node.id + ")");
                node.components.splice(index, 1);
            }
            else
                this.validateGraphComponents(component);
        }

    }

    isAcyclic(node) {
        var component;
        var index = node.components.length;
        node.visited = true;

        while (index--) {
            if((component = this.components[node.components[index]]) == null)
                continue;
            
            if (component.visited) {
                this.onXMLMinorError("child component '" + component.id + "' creates a graph cycle (conflict: ID = " + node.id + ")");
                node.components.splice(index, 1);
                continue;
            }
            
            this.isAcyclic(component);
        }

        node.visited = false;
    }

    fileExists(file) {
        var http = new XMLHttpRequest();
        http.open('HEAD', file, false);
        http.send();
        return http.status != 404;
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
            this.processNode(this.rootNode, null);
    }

    processNode(node, prevNode) {

        this.scene.pushMatrix();

        // Apply transformations
        if (node.transformation !== null) {
            var matrix = node.transformation.isExplicit ? node.transformation.matrix
                : this.transformations[node.transformation.matrix];
            this.scene.multMatrix(matrix);
        }

        // Apply material and texture
        this.applyMaterial(node, prevNode);

        for (var i = 0; i < node.primitives.length; i++) {
            var primitive = this.primitives[node.primitives[i]];
            primitive.updateTexCoords(node.texture.length_s, node.texture.length_t);
            primitive.display();
        }

        for (var i = 0; i < node.components.length; i++) {
            this.processNode(this.components[node.components[i]], node);
        }

        this.scene.popMatrix();
    }

    applyMaterial(node, prevNode) {
        if (node.texture === null) return;

        if (node.getMaterial() == 'inherit') {
            node.setCurrentMaterial(prevNode.getMaterial());
        }

        var material = this.materials[node.getMaterial()];

        if (node.texture.id != 'none') {
            if (node.texture.id == 'inherit')
                node.texture = prevNode.texture;

            material.setTexture(this.textures[node.texture.id]);
        }

        material.apply();

        // Reset material texture
        material.setTexture(null);
    }

    updateMaterials(node) {
        node.nextMaterialIndex();
        node.components.forEach(child => this.updateMaterials(this.components[child]));
    }
}