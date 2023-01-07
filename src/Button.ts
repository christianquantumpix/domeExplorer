import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { DOME_CONFIGURATION } from "./configuration";
import { DomeManager } from "./DomeManager";
import { Tooltip } from "./Tooltip";
import { UIManager } from "./UIManager";
import { VIEWPOINT_ACTIVE_TEXTURE, VIEWPOINT_TEXTURE } from "./settings"

/**
 * Class used to create buttons for navigating to different viewpoints. 
 */
export class ViewpointButton { 
    private _name: string;
    private _scene: Scene;
    private _mesh: Mesh;
    private _position: Vector3;

    // This shouldnt happen here somehow the uiManager should attach the tooltips to stuff. 
    // So in the domeManager after creating the buttons this should happen and the button doesnt need to know about the uiManager. 
    private _tooltip: Tooltip;

    private _domeManager: DomeManager;  
    private _targetKey: keyof typeof DOME_CONFIGURATION;

    // READ ABOVE
    private _uiManager: UIManager;

    private static _material: StandardMaterial;
    private static _materialActive: StandardMaterial;
    private static _materialsInitialized: boolean = false;

    /**
     * Creates a new button used to navigate to different viewpoints. 
     * 
     * @param name name used for the button geometry. 
     * @param scene scene the button gets attached to. 
     * @param size size of the button. 
     * @param position position of the button in 3D space. 
     * @param domeManager domeManager object associated with the current domeExplorer instance. 
     * @param targetKey key of the targeted dome in the configuration. 
     * @param uiManager uiManager associated with the current domeExplorer instance. 
     */
    constructor(name: string, scene: Scene, size: number, position: Vector3, domeManager: DomeManager, targetKey: keyof typeof DOME_CONFIGURATION, uiManager: UIManager) {
        this._name = name;
        this._scene = scene;
        this._mesh = MeshBuilder.CreatePlane("button" + this._name, {size: size}, this._scene);
        this._position = position;
        this._domeManager = domeManager;
        this._targetKey = targetKey;
        this._uiManager = uiManager;
        this._tooltip = this._uiManager.createTooltip(this._name + "Tooltip", this._mesh, DOME_CONFIGURATION[targetKey].name);
    }

    /**
     * Initializes the button. 
     */
    public init(): void {
        this.initMesh();
        this.registerActions();
    }

    /**
     * Initializes the button mesh. 
     */
    private initMesh(): void {
        this._mesh.position = this._position;
        this._mesh.rotation.x = Math.PI / 2;
        this._mesh.material = ViewpointButton._material;
    }

    /**
     * Registers the actions that make the button interactive. 
     */
    private registerActions(): void {
        this.initOverTriggerAction();
        this.initOutTriggerAction();
        this.initPickTriggerAction();
    }

    /**
     * Initializes the default behavior for button hovering. 
     */
    private initOverTriggerAction(): void {
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);
        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    this._mesh.material = ViewpointButton._materialActive;
                }
            )
        );
    } 

    /**
     * Initializes the default behavior for button hover loss. 
     */
    private initOutTriggerAction(): void {
        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    this._mesh.material = ViewpointButton._material;
                }
            )
        );
    }

    /**
     * Initializes the default behavior for button triggering. 
     */
    private initPickTriggerAction(): void {
        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    this._domeManager.domeKey = this._targetKey;
                    this._domeManager.dome.texture = new Texture(
                        DOME_CONFIGURATION[this._targetKey].assetPath, this._scene, true, false, Texture.TRILINEAR_SAMPLINGMODE, () => {
                            this._scene.getEngine().hideLoadingUI();
                        }
                    );
                    this._scene.getEngine().displayLoadingUI();
                    this._domeManager.initDomeButtons();
                }
            )
        );
    }

    /**
     * Initializes the button materials. 
     */
    public static initButtonMaterials(): void {
        if(!ViewpointButton._materialsInitialized) {
            ViewpointButton.initButtonMaterial(false, "viewButton", VIEWPOINT_TEXTURE);
            ViewpointButton.initButtonMaterial(true, "viewButtonActive", VIEWPOINT_ACTIVE_TEXTURE);
            ViewpointButton._materialsInitialized = true;
        }
    }

    /**
     * Initializes a button material with the default settings. 
     * 
     * @param active True if the active material is to be initialized. 
     * @param name Name for the material. 
     * @param texturePath Texture path for the material. 
     */
    private static initButtonMaterial(active: boolean, name: string, texturePath: string): void {
        var buttonMaterial = new StandardMaterial(name);
        buttonMaterial.useAlphaFromDiffuseTexture = true;
        buttonMaterial.alpha = 1;
        buttonMaterial.disableLighting = true;
        let texture = new Texture(texturePath, undefined, false, true, Texture.TRILINEAR_SAMPLINGMODE);
        texture.hasAlpha = true;
        texture.anisotropicFilteringLevel = 16;
        buttonMaterial.diffuseTexture = texture;
        buttonMaterial.emissiveTexture = texture;
        // Worst use of the strategy pattern ever. 
        if(active) {         
            ViewpointButton._materialActive = buttonMaterial;
        } else {
            ViewpointButton._material = buttonMaterial;
        }
    }

    /**
     * disposes of the button mesh. 
     */
    public dispose(): void {
        this._tooltip.dispose();
        this._mesh.dispose();
    }
}
