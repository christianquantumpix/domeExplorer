import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { DOME_CONFIGURATION } from "./configuration";
import { DomeManager } from "./DomeManager";
import { Tooltip } from "./Tooltip";
import { UIManager } from "./UIManager";

export interface Button {
    mesh: Mesh;
    material: StandardMaterial;
    materialActive: StandardMaterial;

    //dispose(): void {}
} 

export class ViewpointButton implements Button { //implements Button
    name: string;
    scene: Scene;

    mesh: Mesh;
    tooltip: Tooltip;

    material: StandardMaterial;
    materialActive: StandardMaterial;

    domeManager: DomeManager;
    targetKey: keyof typeof DOME_CONFIGURATION;

    uiManager: UIManager;

    constructor(
        name: string, size: number, scene: Scene, material: StandardMaterial, materialActive: StandardMaterial, 
        position: Vector3, domeManager: DomeManager, targetPath: string, targetKey: keyof typeof DOME_CONFIGURATION, 
        targetName: string, uiManager: UIManager) {
        
        this.name = name;
        this.scene = scene;

        this.mesh = MeshBuilder.CreatePlane("button" + this.name, {size: size}, this.scene);
        this.mesh.position = position;
        this.mesh.rotation.x = Math.PI / 2;

        this.domeManager = domeManager;
        this.targetKey = targetKey;

        this.material = material;
        this.materialActive = materialActive;

        this.mesh.material = this.material;

        this.uiManager = uiManager;
        this.tooltip = new Tooltip(this.name, scene, this.mesh, this.uiManager, targetName);

        this.registerActions(targetPath);
    }

    registerActions(targetPath: string): void {
        this.mesh.actionManager = this.mesh.actionManager || new ActionManager(this.scene);
        this.mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger, () => {
                    this.mesh.material = this.materialActive;
                }
            )
        );

        this.mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger, () => {
                    this.mesh.material = this.material;
                }
            )
        );

        this.mesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger, () => {
                    this.domeManager.domeKey = this.targetKey;
                    this.domeManager.dome.photoTexture = new Texture(targetPath, this.scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
                    
                    this.domeManager.initDomeViewpoints();
                }
            )
        );
    }

    dispose() {
        this.mesh.dispose();
    }
}
