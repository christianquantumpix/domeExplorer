import { Color4, Engine, FreeCamera, Scene, Vector3 } from "babylonjs";
import { ViewpointButton } from "./Button";
import { COLOR_MAIN, FOV_HORIZONTAL, MESSAGE_WELCOME } from "./configuration";
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
    // Maybe should be extracted into a scene manager class?
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    //
    private _domeManager: DomeManager;
    private _uiManager: UIManager;

    /**
     * Creates a new dome explorer app instance. 
     */
    constructor() {
        this._pageManager = new PageManager();
        this._loadingScreen = new LoadingScreen(this._pageManager.loadingContainer, this._pageManager.loadingText);        
        this._engine = new Engine(this._pageManager.renderCanvas, true);
        this._scene = new Scene(this._engine);
        this._camera = new FreeCamera("camera", Vector3.Zero(), this.scene);
        this._uiManager = new UIManager(this._scene);
        this._domeManager = new DomeManager(this._scene, this._uiManager);
    }

    public start(): void {
        this.initPageManager();
        this.initLoadingUI();
        this.displayLoadingUI();
        this.initScene();
        this.hideLoadingUIWhenLoaded();
        this.showWelcomeMessage();
    }

    /**
     * Initializes the page manager. 
     */
    private initPageManager(): void {
        this._pageManager.init();
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
    private initScene(): void {
        this.initCamera();
        this.initInspector();
        this.initResizing();
        this.initDome();
        this.beginRender();
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
     * Begins rendering the scene. 
     */
    private beginRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
    }

    /**
     * Displays the loading UI. 
     */
    private displayLoadingUI(): void {
        this._engine.displayLoadingUI();
    }

    /**
     * Hides the loading UI. 
     */
    private hideLoadingUI(): void {
        this._engine.hideLoadingUI();
        this._engine.resize(); // Figure out why this is needed and avoid. 
    }

    /**
     * Listens for the scene being ready and hides the loading UI. 
     */
    private hideLoadingUIWhenLoaded() {
        this._scene.executeWhenReady(() => {
            this.hideLoadingUI();
        });
    }

    /**
     * Shows the default welcome message. 
     */
    private showWelcomeMessage() {
        this._scene.executeWhenReady(() => {
            this.uiManager.initInfoBubble();
            this.uiManager.showInfo(MESSAGE_WELCOME, 8000, 1000);
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
