import { ActionManager, Animation, ExecuteCodeAction, Mesh, Scene } from "babylonjs";
import { Ellipse, Line, Rectangle, TextBlock } from "babylonjs-gui";
import { COLOR_MAIN, TOOLTIP_Y } from "./configuration";
import { UIManager } from "./UIManager";

/**
 * Class for creating a tooltip attached to a mesh. 
 */
export class Tooltip {
    private _name: string;
    private _scene: Scene;
    private _uiManager: UIManager;
    private _targetMesh: Mesh;
    private _bubble: Rectangle;
    private _label: TextBlock;
    private _textContent: string;
    private _line: Line;
    private _dot: Ellipse;

    /**
     * Creates a tooltip attached to a target mesh in the scene. 
     * 
     * @param name name to get used in the creation of the tooltip UI geometries. 
     * @param scene scene the tooltip object will be attached to. 
     * @param uiManager uiManager object holding the UI texture to render to. 
     * @param targetMesh mesh object the tooltip is attached to. 
     * @param textContent text content of the tooltip. 
     */
    constructor(name: string, scene: Scene, uiManager: UIManager, targetMesh: Mesh, textContent: string) {
        this._name = name;
        this._scene = scene;
        this._uiManager = uiManager;
        this._targetMesh = targetMesh;
        this._bubble = new Rectangle(this._name + "Rectangle");
        this._label = new TextBlock(this._name + "TextBlock");
        this._textContent = textContent;
        this._line = new Line(this._name + "Line");
        this._dot = new Ellipse(this._name + "Dot");

        this.initTooltipUI();
    }

    /**
     * Initializes the tooltip UI. 
     */
    private initTooltipUI(): void {
        this.initShapes();
        this.initAnimations();
        this.registerActions();
    }

    /**
     * Initializes the tooltip geometries. 
     */
    private initShapes(): void {
        var uiTexture = this._uiManager.UITexture;

        this._line.lineWidth = 3;
        this._line.color = COLOR_MAIN;
        uiTexture.addControl(this._line);
        this._line.linkWithMesh(this._targetMesh);

        this._dot.width = "8px";
        this._dot.height = "8px";
        this._dot.thickness = 0;
        this._dot.background = COLOR_MAIN;
        uiTexture.addControl(this._dot);
        this._dot.linkWithMesh(this._targetMesh);  

        this._bubble.width = "192px";
        this._bubble.height = "40px";
        this._bubble.thickness = 3;
        this._bubble.cornerRadius = 20;
        this._bubble.color = COLOR_MAIN;
        this._bubble.background = "#ffffff";
        uiTexture.addControl(this._bubble);
        this._bubble.linkWithMesh(this._targetMesh);
        this._bubble.linkOffsetY = TOOLTIP_Y;
        this._line.connectedControl = this._bubble;

        this._label.text = this._textContent;
        this._label.fontSize = "16rem"
        this._label.fontWeight = "bold";
        this._label.color = COLOR_MAIN;
        this._label.textWrapping = true;
        this._bubble.addControl(this._label);

        this._bubble.isVisible = false;
        this._line.isVisible = false;
        this._dot.isVisible = false;
    }

    /**
     * Initializes the animations for the tooltip UI. 
     */
    private initAnimations(): void {
        this._bubble.animations = this._bubble.animations || [];
        this._line.animations = this._line.animations || [];
        this._dot.animations = this._dot.animations || [];

        let scaleXAnim = new Animation("scaleX", "scaleX", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let scaleYAnim = new Animation("scaleY", "scaleY", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        let keysScale = [];

        keysScale.push({
            frame: 0,
            value: 0
        });
        keysScale.push({
            frame: 8,
            value: 1
        });

        scaleXAnim.setKeys(keysScale);
        scaleYAnim.setKeys(keysScale);

        let fadeInAnim = new Animation("alpha", "alpha", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysFade = []

        keysFade.push({
            frame: 0,
            value: 0
        });
        keysFade.push({
            frame: 8,
            value: 1
        });

        fadeInAnim.setKeys(keysFade);

        this._bubble.animations.push(scaleXAnim);
        this._bubble.animations.push(scaleYAnim);
        this._bubble.animations.push(fadeInAnim);
        this._line.animations.push(fadeInAnim);
        this._dot.animations.push(fadeInAnim);
    }

    /**
     * Registers the actions that make the tooltip UI interactive. 
     */
    private registerActions(): void {
        this._targetMesh.actionManager = this._targetMesh.actionManager || new ActionManager(this._scene);

        this._targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    this._scene.stopAnimation(this._bubble);
                    this._scene.stopAnimation(this._line);
                    this._scene.stopAnimation(this._dot);
                    this._bubble.isVisible = true;
                    this._line.isVisible = true;
                    this._dot.isVisible = true;
                }
            )
        );

        this._targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => { 
                    this._scene.beginAnimation(this._bubble, 8, 0, false, 1, () => {
                        this._bubble.isVisible = false;
                        this._bubble.alpha = 1;
                        this._bubble.scaleX = 1;
                        this._bubble.scaleY = 1;
                    });
                    this._scene.beginAnimation(this._line, 8, 0, false, 1, () => {
                        this._line.isVisible = false;
                        this._line.alpha = 1;
                    });
                    this._scene.beginAnimation(this._dot, 8, 0, false, 1, () => {
                        this._dot.isVisible = false
                        this._dot.alpha = 1;
                    });
                }
            )
        );

        this._targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    this._bubble.isVisible = false;
                    this._line.isVisible = false;
                    this._dot.isVisible = false;
                }
            )
        );
    }
}
