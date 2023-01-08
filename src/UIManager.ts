import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { InfoBubble } from "./InfoBubble";
import { Tooltip } from "./Tooltip";

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
        this._infoBubble = new InfoBubble("infoBubble", this._scene);
    }

    /**
     * Initializes the info bubble. 
     */
    public initInfoBubble() {
        this._infoBubble.initInfoBubble();
        this._uiCanvas.addControl(this._infoBubble.infoBubble);
    }

    /**
     * Function to show a message to the user for a limited time. 
     * 
     * @param message the string to show do the user. 
     * @param durationMS the duration to show the message for in milliseconds. 
     * @param delayMS The delay to show the message after in milliseconds. 
     */
    public showInfo(message: string, durationMS: number, delayMS?: number): void {
        this._infoBubble.showInfo(message, durationMS, delayMS);
    }

    /**
     * Creates a new tooltip and attaches it to the UI. 
     * 
     * @param name Name used for the tooltip. 
     * @param targetMesh Target mesh to attach the tooltip to. 
     * @param textContent Text content of the toltip. 
     * 
     * @returns The Tooltip. 
     */
    public createTooltip(name: string, targetMesh: Mesh, textContent: string): Tooltip {
        return new Tooltip(name, this._scene, this, targetMesh, textContent);
    }

    /**
     * The UI canvas. 
     */
    public get uiCanvas(): AdvancedDynamicTexture {
        return this._uiCanvas;
    }
}
