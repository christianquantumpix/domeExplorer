import { Animation, Scene } from "babylonjs";
import { Control, Grid, Image, Rectangle, TextBlock } from "babylonjs-gui";
import { COLOR_MAIN, COLOR_WHITE, INFO_TEXTURE, TEXT_SIZE } from "./settings";

/**
 * Class for creating info bubbles within a UI. 
 */
export class InfoBubble {
    private _name: string;
    private _scene: Scene;
    private _infoBubble: Rectangle;
    private _infoBubbleText: TextBlock;
    private _loadingBar: Rectangle;
    
    /**
     * Creates a info bubble to display messages within the UI. 
     * 
     * @param scene Scene object the info bubble will be attached to. 
     */
    constructor(name: string, scene: Scene) {
        this._name = name;
        this._scene = scene;
        this._infoBubble = new Rectangle(name + "Bubble");
        this._infoBubbleText = new TextBlock(name + "Text");
        this._loadingBar = new Rectangle(name + "LoadingBar");
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
        this._infoBubble.topInPixels = 24;
        this._infoBubble.widthInPixels = 512;
        //this._infoBubble.adaptWidthToChildren = true;
        this._infoBubble.heightInPixels = 96;
        this._infoBubble.thickness = 1;
        this._infoBubble.color = COLOR_WHITE;
        this._infoBubble.cornerRadius = 4;
        this._infoBubble.background = COLOR_MAIN;

        // Layout
        let rows = new Grid();
        rows.widthInPixels = 512;
        rows.addRowDefinition(0.9);
        rows.addRowDefinition(0.1);  
        this._infoBubble.addControl(rows);      

        let columns = new Grid();
        columns.addColumnDefinition(.15);
        columns.addColumnDefinition(.85);
        rows.addControl(columns, 0, 0);

        let infoIcon = new Image("infoIcon", INFO_TEXTURE); //Async?? //Redundant??
        infoIcon.widthInPixels = 48;
        infoIcon.heightInPixels = 48;
        infoIcon.stretch = Image.STRETCH_UNIFORM;
        infoIcon.leftInPixels = 12;
        columns.addControl(infoIcon, 0, 0);

        this._loadingBar.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._loadingBar.widthInPixels = 512;
        this._loadingBar.heightInPixels = 8;
        this._loadingBar.transformCenterX = 0;
        this._loadingBar.thickness = 0;
        this._loadingBar.alpha = .5;
        this._loadingBar.background = COLOR_WHITE;
        rows.addControl(this._loadingBar, 1, 0);

        this._infoBubbleText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._infoBubbleText.fontSizeInPixels = TEXT_SIZE;
        this._infoBubbleText.color = COLOR_WHITE;
        this._infoBubbleText.textWrapping = true;
        this._infoBubbleText.setPadding(12, 12, 12, 12);
        columns.addControl(this._infoBubbleText, 0, 1);

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
     * @param message The string to show do the user. 
     * @param durationMS The duration to show the message for in milliseconds. 
     * @param delayMS The delay to show the message after in milliseconds. 
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

    public get infoBubble() {
        return this._infoBubble;
    }
}
