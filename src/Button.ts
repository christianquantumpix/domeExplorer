import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { DOME_CONFIGURATION } from "./configuration";
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
    private _tooltip: Tooltip;
    private _material: StandardMaterial;
    private _materialActive: StandardMaterial;
    private _domeManager: DomeManager;
    private _targetKey: keyof typeof DOME_CONFIGURATION;
    private _targetPath: string;
    private _uiManager: UIManager;

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
        name: string, scene: Scene, size: number, material: StandardMaterial, materialActive: StandardMaterial, 
        position: Vector3, domeManager: DomeManager, targetPath: string, targetKey: keyof typeof DOME_CONFIGURATION, 
        targetName: string, uiManager: UIManager) 
    {
        this._name = name;
        this._scene = scene;
        this._mesh = MeshBuilder.CreatePlane("button" + this._name, {size: size}, this._scene);
        this._mesh.position = position;
        this._mesh.rotation.x = Math.PI / 2;
        this._domeManager = domeManager;
        this._targetKey = targetKey;
        this._material = material;
        this._materialActive = materialActive;
        this._mesh.material = this._material;
        this._uiManager = uiManager;
        this._tooltip = new Tooltip(this._name, scene, this._uiManager, this._mesh, targetName);
        this._targetPath = targetPath;

        this.registerActions();
    }

    /**
     * Registers the actions that make the button interactive. 
     */
    private registerActions(): void {
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);
        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    this._mesh.material = this._materialActive;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    this._mesh.material = this._material;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    this._domeManager.domeKey = this._targetKey;
                    this._domeManager.dome.photoTexture = new Texture(this._targetPath, this._scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
                    this._domeManager.initDomeButtons();
                }
            )
        );
    }

    /**
     * disposes of the button mesh. 
     */
    public dispose(): void {
        this._mesh.dispose();
    }
}
