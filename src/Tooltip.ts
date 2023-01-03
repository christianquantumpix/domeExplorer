import { ActionManager, Animation, ExecuteCodeAction, Mesh, Scene } from "babylonjs";
import { Line, Rectangle, TextBlock } from "babylonjs-gui";
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
        line.alpha = 0.5;
        line.lineWidth = 4;
        line.dash = [5, 10];
        line.color = COLOR_MAIN;
        uiTexture.addControl(line);

        line.linkWithMesh(this._mesh);

        var bubble = new Rectangle(this._name + "Rectangle");
        bubble.width = "192px";
        bubble.height = "40px";
        bubble.cornerRadius = 20;
        bubble.color = "#ffffff";
        bubble.alpha = UI_ALPHA;
        bubble.thickness = 3;
        bubble.background = COLOR_MAIN;
        uiTexture.addControl(bubble);

        bubble.linkWithMesh(this._mesh);
        bubble.linkOffsetY = TOOLTIP_Y;

        line.connectedControl = bubble;

        var text = new TextBlock(this._name + "TextBlock");
        text.text = targetName;
        text.fontSize = "16rem"
        text.color = "#ffffff";
        text.textWrapping = true;
        bubble.addControl(text);

        line.isVisible = false;
        bubble.isVisible = false;

        this.initAnimations(bubble);
        this.registerActions(bubble, line);
    }

    initAnimations(bubble: Rectangle) {
        // Animation behavior
        let scaleXAnimation = new Animation("scaleX", "scaleX", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let scaleYAnimation = new Animation("scaleY", "scaleY", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        let keys = [];

        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 10,
            value: 1
        });

        scaleXAnimation.setKeys(keys);
        scaleYAnimation.setKeys(keys);

        bubble.animations = bubble.animations || [];

        bubble.animations.push(scaleXAnimation);
        bubble.animations.push(scaleYAnimation);

        let moveUpAnimation = new Animation("moveUp", "linkOffsetY", 30, Animation.ANIMATIONTYPE_SIZE, Animation.ANIMATIONLOOPMODE_CONSTANT);
        let keysMoveUp = []

        keysMoveUp.push({
            frame: 0,
            value: 0
        });
        keysMoveUp.push({
            frame: 0,
            value: TOOLTIP_Y
        });

        moveUpAnimation.setKeys(keysMoveUp);
        bubble.animations.push(moveUpAnimation);
    }

    registerActions(bubble: Rectangle, line: Line) {
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    bubble.isVisible = true;
                    line.isVisible = true;
                    this._scene.beginAnimation(bubble, 0, 10, false);
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    bubble.isVisible = false;
                    line.isVisible = false;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    bubble.isVisible = false;
                    line.isVisible = false;
                }
            )
        );
    }
}
