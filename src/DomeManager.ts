import { ViewpointButton } from "./Button";
import { DOME_CONFIGURATION, DOME_STARTING_KEY } from "./configuration";
import { UIManager } from "./UIManager";
import { BUTTON_DISTANCE, BUTTON_SIZE, DOME_DIAMETER } from "./settings";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { PhotoDome } from "@babylonjs/core/Helpers/photoDome";

/**
 * Class for managing the dome network. 
 */
export class DomeManager {
    private _scene: Scene;
    private _domeKey: keyof typeof DOME_CONFIGURATION;
    private _dome: PhotoDome;

    // This stuff should possibly be handled by the UI manager. 
    private _viewButtons: Array<ViewpointButton>;
    private _uiManager: UIManager;

    /**
     * Creates a dome manager instance. 
     * 
     * @param scene Scene element the dome structure will be attacheed to. 
     * @param uiManager UI manager for the current app instance. 
     */
    constructor(scene: Scene, uiManager: UIManager) {
        this._scene = scene;
        this._domeKey = DOME_STARTING_KEY;
        // Async but doesn't matter. 
        this._dome = new PhotoDome("dome", DOME_CONFIGURATION[this._domeKey].assetPath, {size: DOME_DIAMETER}, this._scene);
        this._viewButtons = [];
        this._uiManager = uiManager;
    }

    /**
     * Initializes the dome manager. 
     */
    public init(): void {
        ViewpointButton.initButtonMaterials();
    }

    /**
     * Creates and places the viewpoint buttons for the current dome. 
     */
    public createViewpointButtons(): void {
        // Remove the old set of viewpoint buttons. 
        for(let i = 0; i < this._viewButtons.length; i++) {
            this._viewButtons[i].dispose();
        }
        this._viewButtons.length = 0;

        // Set up new set of viewpoint buttons. 
        type keyType = keyof typeof DOME_CONFIGURATION; // Type alias. 
        let currentDome = DOME_CONFIGURATION[this._domeKey];
        for(let j = 0; j < currentDome.hotspots.length; j++) {
            let currentHotspot = currentDome.hotspots[j];
            let targetKey = DOME_CONFIGURATION[this._domeKey].hotspots[j].target as keyType;
            let tooltipText = DOME_CONFIGURATION[targetKey].name;
            let buttonPosition = DomeManager.getPositionFromPixelPosition(currentHotspot.position, currentDome.resolution, BUTTON_DISTANCE);
            let button = new ViewpointButton("button", this._scene, BUTTON_SIZE, buttonPosition, this._uiManager, tooltipText);

            this.initViewpointButton(button, targetKey);
        }
    }

    /**
     * Initializes a viewpoint button. 
     * 
     * @param button The button that gets initialized. 
     * @param targetKey The target key for the button. 
     */
    private initViewpointButton(button: ViewpointButton, targetKey: keyof typeof DOME_CONFIGURATION): void {
        button.init();
        button.registerPickTriggerAction(() => {
            this.domeKey = targetKey;
            this.dome.texture = new Texture(
                DOME_CONFIGURATION[targetKey].assetPath, this._scene, true, false, Texture.TRILINEAR_SAMPLINGMODE, () => {
                    this._scene.getEngine().hideLoadingUI();
                }
            );
            this._scene.getEngine().displayLoadingUI();
            this.createViewpointButtons();
        });

        // Add viewpoint button to the current list of viewpoint buttons. 
        this._viewButtons.push(button);
    }

    /**
     * Function to get a position in 3D space from pixel coordinates on a dome texture. 
     * 
     * @param position target pixel coordinates. 
     * @param resolution texture resolution. 
     * @param distance target distance from the origin. 
     * 
     * @returns position in 3D space. 
     */
    static getPositionFromPixelPosition(position: Vector2, resolution: Vector2, distance: number): Vector3 {
        // Simplify this disease of a formula.
        let positionX = Math.cos(-2 * Math.PI * position.x / resolution.x);
        let positionZ = Math.sin(-2 * Math.PI * position.x / resolution.x);
        let positionY = Math.sin(Math.PI * (.5 - position.y / resolution.y));
        // Scaling factor to normalize. 
        let scalingFactor = Math.cos(Math.PI * (.5 - position.y / resolution.y));
        positionX *= scalingFactor;
        positionZ *= scalingFactor;

        let position3D = new Vector3(positionX, positionY, positionZ);
        position3D.scaleInPlace(distance);

        return position3D;
    }

    /**
     * The key of the current dome. 
     * 
     * @type keyof typeof DOME_CONFIGURATION
     */
    public get domeKey(): keyof typeof DOME_CONFIGURATION {
        return this._domeKey;
    }

    /**
     * Sets the key for the current dome. 
     * 
     * @param key Key to set the domeKey variable to. 
     */
    public set domeKey(key: keyof typeof DOME_CONFIGURATION) {
        this._domeKey = key;
    }
    
    /**
     * Returns the photo dome. 
     * 
     * @type PhotoDome
     */
    public get dome(): PhotoDome {
        return this._dome;
    }
}
