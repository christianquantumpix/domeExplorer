import { Scene } from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";
import { InfoBubble } from "./InfoBubble";

/**
 * Class used for managing a global UI canvas and global UI elements. 
 */
export class UIManager {
    private _scene: Scene;
    private _uiCanvas: AdvancedDynamicTexture;
    private _infoBubble: InfoBubble;
   
    /**
     * Creates a global UI with a global info bubble for a given scene. 
     * 
     * @param scene scene to create this global UI for. 
     */
    constructor(scene: Scene) {
        this._scene = scene;
        this._uiCanvas = AdvancedDynamicTexture.CreateFullscreenUI("uiCanvas", true, this._scene);
        this._infoBubble = new InfoBubble(this._scene, this._uiCanvas);
    }

    /**
     * Initializes the info bubble. 
     */
    public initInfoBubble() {
        this._infoBubble.initInfoBubble();
    }

    /**
     * Function to show a message to the user for a limited time. 
     * 
     * @param message the string to show do the user. 
     * @param durationMS the duration to show the message for in milliseconds.  
     */
    public showInfo(message: string, durationMS: number, delayMS?: number): void {
        this._infoBubble.showInfo(message, durationMS, delayMS);
    }

    /**
     * The UI canvas. 
     */
    public get uiCanvas(): AdvancedDynamicTexture {
        return this._uiCanvas;
    }
}
