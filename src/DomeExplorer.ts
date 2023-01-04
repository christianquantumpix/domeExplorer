import { Color4, Engine, FreeCamera, Scene, Vector3 } from "babylonjs";
import { ViewpointButton } from "./Button";
import { COLOR_MAIN, FOV_HORIZONTAL } from "./configuration";
import { DomeManager } from "./DomeManager";
import { LoadingScreen } from "./LoadingScreen";
import { PageManager } from "./PageManager";
import { UIManager } from "./UIManager";

/**
 * Class used for handling the apps main functionality. 
 */
export class DomeExplorer {
    private _pageManager: PageManager;
    private _loadingScreen: LoadingScreen;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _uiManager: UIManager;
    private _domeManager: DomeManager;

    /**
     * Creates a new dome explorer app instance. 
     * 
     * @param pageManager page manager object containing the page layout to work on. 
     */
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

    /**
     * Initializes the loading UI. 
     */
    private initLoadingUI(): void {
        this._scene.clearColor = Color4.FromHexString(COLOR_MAIN);
        this._engine.loadingScreen = this._loadingScreen;
    }

    /**
     * Initializes the scene. 
     */
    public initScene(): void {
        this.initCamera();
        this.initInspector();
        this.initResizing();
        this.initDome();
    }

    /**
     * Initializes the camera. 
     */
    private initCamera(): void {
        this._camera.attachControl(this._pageManager.renderCanvas, true);
        this._camera.inputs.attached.keyboard.detachControl();  
        this._camera.fov = FOV_HORIZONTAL;
    }

    /**
     * Initializes the inspector functionality for debugging. 
     */
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

    /**
     * Attaches a listener to the window object to handle resizing of the render canvas. 
     */
    private initResizing(): void {
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
    }

    /**
     * Initializes the dome globally. 
     */
    private initDome(): void {
        ViewpointButton.initMaterials();
        this._domeManager.initDomeButtons();
    }

    /**
     * Displays the loading UI. 
     */
    public displayLoadingUI(): void {
        this._engine.displayLoadingUI();
    }

    /**
     * Hides the loading UI. 
     */
    public hideLoadingUI(): void {
        this._engine.hideLoadingUI();
        this._engine.resize(); // Figure out why this is needed and avoid. 
    }

    /**
     * Begins rendering the scene. 
     */
    public beginRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    /**
     * the page menager. 
     */
    public get pageManager(): PageManager {
        return this._pageManager;
    }

    /**
     * the engine. 
     */
    public get engine(): Engine {
        return this._engine;
    }
    
    /**
     * the loading screen. 
     */
    public get loadingScreen(): LoadingScreen {
        return this._loadingScreen;
    } 

    /**
     * the scene. 
     */
    public get scene(): Scene {
        return this._scene;
    }

    /**
     * the camera. 
     */
    public get camera(): FreeCamera {
        return this._camera;
    }

    /**
     * the UI manager. 
     */
    public get uiManager(): UIManager {
        return this._uiManager;
    }
}
