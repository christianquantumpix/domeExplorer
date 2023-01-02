import { ActionManager, ExecuteCodeAction, Mesh, Scene } from "babylonjs";
import { Rectangle, TextBlock } from "babylonjs-gui";
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

        this.initializeTooltipUI(targetName);
    }

    initializeTooltipUI(targetName: string) {
        var uiTexture = this._UIManager.UITexture;

        var bubble = new Rectangle(this._name + "Rectangle");
        bubble.width = "192px";
        bubble.height = "40px";
        bubble.cornerRadius = 20;
        bubble.color = "#ffffff";
        bubble.alpha = UI_ALPHA;
        bubble.thickness = 3;
        bubble.background = COLOR_MAIN;
        uiTexture.addControl(bubble);

        var text = new TextBlock(this._name + "TextBlock");
        text.text = targetName;
        text.fontSize = "16rem"
        text.color = "#ffffff";
        bubble.addControl(text);

        bubble.linkWithMesh(this._mesh);   
        bubble.linkOffsetY = TOOLTIP_Y;

        bubble.isVisible = false;

        this.registerActions(bubble);
    }

    registerActions(bubble: Rectangle) {
        this._mesh.actionManager = this._mesh.actionManager || new ActionManager(this._scene);

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    bubble.isVisible = true;                  
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    bubble.isVisible = false;
                }
            )
        );

        this._mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    bubble.isVisible = false;
                }
            )
        );
    }
}
