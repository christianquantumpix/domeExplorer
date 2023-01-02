import { Color4, Engine, FreeCamera, Scene, Vector3 } from "babylonjs";
import { COLOR_MAIN, FOV_HORIZONTAL } from "./configuration";
import { DomeManager } from "./DomeManager";
import { LoadingScreen } from "./LoadingScreen";
import { PageManager } from "./PageManager";
import { UIManager } from "./UIManager";

export class DomeExplorer {
    private _pageManager: PageManager;
    private _loadingScreen: LoadingScreen;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _uiManager: UIManager;
    private _domeManager: DomeManager;

    constructor(pageManager: PageManager) {
        this._pageManager = pageManager;
        this._loadingScreen = new LoadingScreen(this._pageManager.loadingScreenContainer); // Create a loading screen. 
        
        this._engine = new Engine(this._pageManager.renderCanvas, true); // Create the babylon scene and engine. 
        this._scene = new Scene(this._engine); 
        this._camera = new FreeCamera("camera", Vector3.Zero(), this.scene); // Create the babylon camera to render from.    
        
        this._uiManager = new UIManager(this._scene);
        this._domeManager = new DomeManager(this._scene, this._uiManager);

        this.initLoadingUI();
    }

    private initLoadingUI(): void {
        this._engine.loadingScreen = this._loadingScreen;
    }

    public initScene(): void {
        this.initCamera();
        this.initInspector();
        this.initResizing();
        this.initDome();
    }

    private initCamera(): void {
        this._camera.attachControl(this._pageManager.renderCanvas, true);
        this._camera.inputs.remove(this._camera.inputs.attached.FreeCameraKeyboardMoveInput);
        this._camera.fov = FOV_HORIZONTAL;
    }

    private initInspector(): void {
        window.addEventListener("keydown", (ev) => {
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });
    }

    private initResizing() {
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
    }

    // Absolute dirt
    private initDome(): void {
        this._domeManager.initButtonMaterials();
        this._domeManager.initDomeViewpoints();
    }

    public displayLoadingUI(): void {
        this._engine.displayLoadingUI();
    }

    public hideLoadingUI(): void {
        this._engine.hideLoadingUI();
        this._engine.resize(); // Figure out why this is needed and avoid. 
    }

    public beginRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    // Getters and setters: 
    public get pageManager(): PageManager {
        return this._pageManager;
    }

    public get engine(): Engine {
        return this._engine;
    }

    public get loadingScreen(): LoadingScreen {
        return this._loadingScreen;
    } 

    public get scene(): Scene {
        return this._scene;
    }

    public get camera(): FreeCamera {
        return this._camera;
    }
}
