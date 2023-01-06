import { PhotoDome, Scene, Vector2, Vector3 } from "babylonjs";
import { ViewpointButton } from "./Button";
import { BUTTON_DISTANCE, BUTTON_SIZE, DOME_CONFIGURATION, DOME_DIAMETER, DOME_STARTING_KEY } from "./configuration";
import { UIManager } from "./UIManager";

/**
 * Class for Managing the dome network. 
 */
export class DomeManager {
    private _scene: Scene;
    private _domeKey: keyof typeof DOME_CONFIGURATION;
    private _dome: PhotoDome;
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
        this._dome = new PhotoDome("dome", DOME_CONFIGURATION[this._domeKey].assetPath, {size: DOME_DIAMETER}, this._scene);
        this._viewButtons = [];
        this._uiManager = uiManager;
    }

    /**
     * A really disgusting implementation. 
     */
    public initDomeButtons(): void {
        // Remove the old set of viewpoint buttons. 
        for(var i = 0; i < this._viewButtons.length; i++) {
            this._viewButtons[i].dispose();
        }
        this._viewButtons.length = 0;

        // Set up new set of viewpoint buttons. 
        type keyType = keyof typeof DOME_CONFIGURATION;
        let currentDome = DOME_CONFIGURATION[this._domeKey];
        
        for(var j = 0; j < currentDome.hotspots.length; j++) {
            let buttonPosition = DomeManager.getPositionFromPixelPosition(currentDome.hotspots[j].position, currentDome.resolution, BUTTON_DISTANCE);
            
            let button = new ViewpointButton(
                "button", this._scene, BUTTON_SIZE, buttonPosition, this,
                DOME_CONFIGURATION[currentDome.hotspots[j].target as keyType].assetPath, //Try to avoid this casting.
                DOME_CONFIGURATION[this._domeKey].hotspots[j].target as keyType, // Try to avoid this casting. 
                DOME_CONFIGURATION[currentDome.hotspots[j].target as keyType].name, // Try to avoid this casting. 
                this._uiManager
            );

            // Add viewpoint button to the curent list of viewpoint buttons. 
            this._viewButtons.push(button);
        }
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
        // Simplify this desease of a formula.
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
     */
    public get domeKey(): keyof typeof DOME_CONFIGURATION {
        return this._domeKey;
    }

    /**
     * Sets the key for the current dome. 
     */
    public set domeKey(key: keyof typeof DOME_CONFIGURATION) {
        this._domeKey = key;
    }
    
    /**
     * Returns the photo dome. 
     * 
     * @returns dome. 
     */
    public get dome(): PhotoDome {
        return this._dome;
    }
}
