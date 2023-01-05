import { Animation, Scene } from "babylonjs";
import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from "babylonjs-gui";
import { COLOR_MAIN, COLOR_WHITE, TEXT_SIZE } from "./configuration";

/**
 * Class used for managing a global UI canvas and global UI elements. 
 */
export class UIManager {
    private _scene: Scene;
    private _uiCanvas: AdvancedDynamicTexture;
    private _infoBubble: Rectangle;
    private _infoBubbleText: TextBlock;
    private _loadingBar: Rectangle;
   
    /**
     * Creates a global UI with a global info bubble for a given scene. 
     * 
     * @param scene scene to create this global UI for. 
     */
    constructor(scene: Scene) {
        this._scene = scene;
        this._uiCanvas = AdvancedDynamicTexture.CreateFullscreenUI("uiCanvas", true, this._scene);
        this._infoBubble = new Rectangle("controlsExplanationBubble");
        this._infoBubbleText = new TextBlock("infoText");
        this._loadingBar = new Rectangle("loadingBar");
    }

    /**
     * Initializes the info bubble. 
     */
    public initInfoBubble() {
        this.initShapes();
        this.initAnimations();
    }

    /**
     * Initializes the geometries for the info bubble. 
     */
    private initShapes(): void {
        this._infoBubble.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._infoBubble.top = "24px";

        this._infoBubble.width = "512px";
        //this._infoBubble.adaptWidthToChildren = true;

        this._infoBubble.height = "72px";
        this._infoBubble.thickness = 1;
        this._infoBubble.color = COLOR_WHITE;
        this._infoBubble.cornerRadius = 4;
        this._infoBubble.background = COLOR_MAIN;
        this._uiCanvas.addControl(this._infoBubble);

        this._loadingBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._loadingBar.width = "512px";
        this._loadingBar.height = "8px";
        this._loadingBar.transformCenterX = 0;
        this._loadingBar.thickness = 0;
        this._loadingBar.alpha = .5;
        this._loadingBar.background = COLOR_WHITE;
        this._infoBubble.addControl(this._loadingBar);

        this._infoBubbleText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._infoBubbleText.fontSize = TEXT_SIZE;
        this._infoBubbleText.color = COLOR_WHITE;
        this._infoBubbleText.textWrapping = true;
        this._infoBubbleText.setPadding(12, 12, 12, 12);
        this._infoBubble.addControl(this._infoBubbleText);

        this._infoBubble.isVisible = false;
    }

    /**
     * Initializes the animations for the info bubble. 
     */
    private initAnimations(): void {
        let scaleXAnim = new Animation("scaleX", "scaleX", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let scaleYAnim = new Animation("scaleY", "scaleY", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        let keysScale = [];

        keysScale.push({frame: 0, value: 0});
        keysScale.push({frame: 8, value: 1});

        scaleXAnim.setKeys(keysScale);
        scaleYAnim.setKeys(keysScale);

        let fadeInAnim = new Animation("alpha", "alpha", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysFade = []

        keysFade.push({frame: 0, value: 0});
        keysFade.push({frame: 8, value: 1});

        fadeInAnim.setKeys(keysFade);

        this._infoBubble.animations = this._infoBubble.animations || [];
        this._loadingBar.animations = this._loadingBar.animations || [];

        this._infoBubble.animations.push(scaleXAnim);
        this._infoBubble.animations.push(scaleYAnim);
        this._infoBubble.animations.push(fadeInAnim);

        this._loadingBar.animations.push(scaleXAnim);
    };

    /**
     * Function to show a message to the user for a limited time. 
     * 
     * @param message the string to show do the user. 
     * @param durationMS the duration to show the message for in milliseconds.  
     */
    public showInfo(message: string, durationMS: number, delayMS?: number): void {
        let delay = delayMS || 0;

        this._infoBubbleText.text = message;

        window.setTimeout(
            () => {
                this._infoBubble.isVisible = true;
            },
            delay
        ); 

        window.setTimeout(
            () => {
                this._scene.beginAnimation(this._infoBubble, 8, 0, false, 1, () => {
                    this._infoBubble.isVisible = false;
                    this._infoBubble.alpha = 1;
                    this._infoBubble.scaleX = 1;
                    this._infoBubble.scaleY = 1;
                });
            }, 
            durationMS + delay
        );
        
        this._scene.beginAnimation(this._loadingBar, 8, 0, false, 8 * 1000 / (30 * durationMS));
    }

    /**
     * The UI canvas. 
     */
    public get uiCanvas(): AdvancedDynamicTexture {
        return this._uiCanvas;
    }
}
