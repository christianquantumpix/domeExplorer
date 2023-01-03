import { ActionManager, Animation, ExecuteCodeAction, Mesh, Scene } from "babylonjs";
import { Ellipse, Line, Rectangle, TextBlock } from "babylonjs-gui";
import { COLOR_MAIN, TOOLTIP_Y, UI_ALPHA } from "./configuration";
import { UIManager } from "./UIManager";

export class Tooltip {
    private _name: string;
    private _mesh: Mesh;
    private _UIManager: UIManager;
    private _scene: Scene;

    constructor(name: string, scene: Scene, mesh: Mesh, UIManager: UIManager, targetName: string) {
        this._name = name;
        this._mesh = mesh;
        this._UIManager = UIManager;
        this._scene = scene;

        this.initTooltipUI(targetName);
    }

    initTooltipUI(targetName: string) {
        var uiTexture = this._UIManager.UITexture;

        var line = new Line(this._name + "Line");
        line.lineWidth = 3;
        line.color = COLOR_MAIN;
        uiTexture.addControl(line);
        line.linkWithMesh(this._mesh);

        var circle = new Ellipse();
        circle.width = "8px";
        circle.height = "8px";
        circle.thickness = 0;
        circle.background = COLOR_MAIN;
        uiTexture.addControl(circle);
        circle.linkWithMesh(this._mesh);  

        var bubble = new Rectangle(this._name + "Rectangle");
        bubble.width = "192px";
        bubble.height = "40px";
        bubble.thickness = 3;
        bubble.cornerRadius = 20;
        bubble.color = COLOR_MAIN;
        bubble.background = "#ffffff";
        uiTexture.addControl(bubble);
        bubble.linkWithMesh(this._mesh);
        bubble.linkOffsetY = TOOLTIP_Y;

        line.connectedControl = bubble;

        var text = new TextBlock(this._name + "TextBlock");
        text.text = targetName;
        text.fontSize = "16rem"
        text.fontWeight = "bold";
        text.color = COLOR_MAIN;
        text.textWrapping = true;
        bubble.addControl(text);

        bubble.isVisible = false;
        line.isVisible = false;
        circle.isVisible = false;

        this.initAnimations(bubble, line, circle);
        this.registerActions(bubble, line, circle);
    }

    initAnimations(bubble: Rectangle, line: Line, circle: Ellipse) {
        bubble.animations = bubble.animations || [];
        line.animations = line.animations || [];
        circle.animations = circle.animations || [];

        let scaleXAnim = new Animation("scaleX", "scaleX", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let scaleYAnim = new Animation("scaleY", "scaleY", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        let keysScale = [];

        keysScale.push({
            frame: 0,
            value: 0
        });
        keysScale.push({
            frame: 10,
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
            frame: 10,
            value: 1
        });

        fadeInAnim.setKeys(keysFade);

        bubble.animations.push(scaleXAnim);
        bubble.animations.push(scaleYAnim);
        bubble.animations.push(fadeInAnim);
        line.animations.push(fadeInAnim);
        circle.animations.push(fadeInAnim);
    }

    registerActions(bubble: Rectangle, line: Line, circle: Ellipse) {
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    bubble.isVisible = true;
                    line.isVisible = true;
                    circle.isVisible = true;
                    this._scene.beginAnimation(bubble, 0, 10, false);
                    this._scene.beginAnimation(line, 0, 10, false);
                    this._scene.beginAnimation(circle, 0, 10, false);
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    bubble.isVisible = false;
                    line.isVisible = false;
                    circle.isVisible = false;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    bubble.isVisible = false;
                    line.isVisible = false;
                    circle.isVisible = false;
                }
            )
        );
    }
}
