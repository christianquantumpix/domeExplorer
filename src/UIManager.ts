import { Scene } from "babylonjs";
import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from "babylonjs-gui";
import { COLOR_MAIN } from "./configuration";

export class UIManager {
    private _scene: Scene;
    private _uiTexture: AdvancedDynamicTexture;
    private _infoBubble: Rectangle;
    private _infoBubbleText: TextBlock;
   
    constructor(scene: Scene) {
        this._scene = scene;
        this._uiTexture = AdvancedDynamicTexture.CreateFullscreenUI("uiTexture", true, this._scene);
        this._infoBubble = new Rectangle("controlsExplanationBubble");
        this._infoBubbleText = new TextBlock("infoText");
    }

    public initInfoBubble() {
        this._infoBubble.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._infoBubble.top = "32px";
        this._infoBubble.width = "320px";
        this._infoBubble.height = "64px";
        this._infoBubble.thickness = 3;
        this._infoBubble.cornerRadius = 20;
        this._infoBubble.color = COLOR_MAIN;
        this._infoBubble.background = "#ffffff";
        this._uiTexture.addControl(this._infoBubble);

        //this._infoBubbleText.text = "Welcome to the crappiest app ever!";
        this._infoBubbleText.fontSize = "16rem"
        this._infoBubbleText.fontWeight = "bold";
        this._infoBubbleText.color = COLOR_MAIN;
        this._infoBubbleText.textWrapping = true;
        this._infoBubble.addControl(this._infoBubbleText);

        this._infoBubble.isVisible = false;
        this._infoBubbleText.isVisible = false;
    }

    public showInfo(message: string, duration: number): void {
        this._infoBubbleText.text = message;
        this._infoBubble.isVisible = true;
        this._infoBubbleText.isVisible = true;

        window.setTimeout(
            () => {
                this._infoBubble.isVisible = false;
                this._infoBubbleText.isVisible = false;
            }, 
            duration
        );
    }

    public get UITexture(): AdvancedDynamicTexture {
        return this._uiTexture;
    }
}
