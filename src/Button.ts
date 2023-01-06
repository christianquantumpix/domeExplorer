import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { DOME_CONFIGURATION, VIEWPOINT_ACTIVE_TEXTURE, VIEWPOINT_TEXTURE } from "./configuration";
import { DomeManager } from "./DomeManager";
import { Tooltip } from "./Tooltip";
import { UIManager } from "./UIManager";

/**
 * Class used to create buttons for navigating to different viewpoints. 
 */
export class ViewpointButton { 
    private _name: string;
    private _scene: Scene;
    private _mesh: Mesh;
    private _position: Vector3;
    private _tooltip: Tooltip;
    private _domeManager: DomeManager;
    private _targetKey: keyof typeof DOME_CONFIGURATION;
    private _targetPath: string;
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
     * @param material material of the button. 
     * @param materialActive material of the button if hovered over. 
     * @param position position of the button in 3D space. 
     * @param domeManager domeManager object associated with the current domeExplorer instance. 
     * @param targetPath texture path of the targeted dome.  
     * @param targetKey key of the targeted dome in the configuration. 
     * @param targetName name of the targeted dome. 
     * @param uiManager uiManager associated with the current domeExplorer instance. 
     */
    constructor(
        name: string, scene: Scene, size: number, position: Vector3, domeManager: DomeManager, targetPath: string, 
        targetKey: keyof typeof DOME_CONFIGURATION, targetName: string, uiManager: UIManager) 
    {
        this._name = name;
        this._scene = scene;
        this._mesh = MeshBuilder.CreatePlane("button" + this._name, {size: size}, this._scene);
        this._position = position;
        this._domeManager = domeManager;
        this._targetKey = targetKey;
        this._uiManager = uiManager;
        this._tooltip = this._uiManager.createTooltip(this._name + "Tooltip", this._mesh, targetName);
        this._targetPath = targetPath;
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
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);
        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    this._mesh.material = ViewpointButton._materialActive;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    this._mesh.material = ViewpointButton._material;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    this._domeManager.domeKey = this._targetKey;
                    this._domeManager.dome.texture = new Texture(
                        this._targetPath, this._scene, true, false, Texture.TRILINEAR_SAMPLINGMODE, () => {
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
    public static initMaterials(): void {
        if(!ViewpointButton._materialsInitialized) {
            var buttonMaterial = new StandardMaterial("viewButton");
            var buttonMaterialActive = new StandardMaterial("viewButtonActive");

            buttonMaterial.useAlphaFromDiffuseTexture = true;
            buttonMaterialActive.useAlphaFromDiffuseTexture = true;
            buttonMaterial.alpha = 0.75;
            buttonMaterialActive.alpha = 0.75;
            buttonMaterial.disableLighting = true;
            buttonMaterialActive.disableLighting = true;

            let texture = new Texture(VIEWPOINT_TEXTURE, undefined, false, true, Texture.TRILINEAR_SAMPLINGMODE);
            let textureActive = new Texture(VIEWPOINT_ACTIVE_TEXTURE, undefined, false, true, Texture.TRILINEAR_SAMPLINGMODE);
            texture.hasAlpha = true;
            textureActive.hasAlpha = true;
            texture.anisotropicFilteringLevel = 16;
            textureActive.anisotropicFilteringLevel = 16;

            buttonMaterial.diffuseTexture = texture;
            buttonMaterial.emissiveTexture = texture;
            buttonMaterialActive.diffuseTexture = textureActive;
            buttonMaterialActive.emissiveTexture = textureActive;

            ViewpointButton._material = buttonMaterial;
            ViewpointButton._materialActive = buttonMaterialActive;
            ViewpointButton._materialsInitialized = true;
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
