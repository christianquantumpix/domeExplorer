import { Scene } from "babylonjs";
import { AdvancedDynamicTexture } from "babylonjs-gui";

export class UIManager {
    private _scene: Scene;
    private _uiTexture: AdvancedDynamicTexture;
   
    constructor(scene: Scene) {
        this._scene = scene;
        this._uiTexture = AdvancedDynamicTexture.CreateFullscreenUI("uiTexture", true, this._scene);
    }

    public get UITexture(): AdvancedDynamicTexture {
        return this._uiTexture;
    }
}
