import { MASCOT_TEXTURE } from "./configuration";
import { RANDOM_FACTS } from "./randomFacts";

/**
 * Class for managing the creation of DOM elements for a domeExplorer instance.
 */
export class PageManager {
    private _appContainer: HTMLElement;
    private _renderCanvas: HTMLCanvasElement;
    private _loadingScreenContainer: HTMLDivElement;
    private _isInitialized: boolean;

    /**
     * Manages the creation of DOM elements for an domeExplorer instance. 
     * 
     * @param appContainer div element to render the app instance in. 
     */
    constructor();
    constructor(appContainer?: HTMLDivElement) {
        this._appContainer = appContainer || document.body;
        this._renderCanvas = document.createElement("canvas");
        this._loadingScreenContainer = document.createElement("div");
        this._isInitialized = false;
    }

    /**
     * Initializes the page layout for the app. 
     * @remarks
     * If the page layout has already been initialized this step is skipped. 
     */
    public init(): void {
        if (!this._isInitialized) {
            this.initializeLoadingScreenContainer();
            this.initializeCanvas();
            this._isInitialized = true;
        }
    }

    /**
     * Initializes the loading screen DOM elements. 
     * @remarks
     * Avoids assigning id's to DOM elements for better readability. 
     */
    private initializeLoadingScreenContainer(): void {
        this._loadingScreenContainer.classList.add("loadingScreenContainer");
        this._appContainer.appendChild(this._loadingScreenContainer);

        let loadingScreenLampAnimation = document.createElement("div");
        loadingScreenLampAnimation.classList.add("loadingScreenLampAnimation");
        this._loadingScreenContainer.appendChild(loadingScreenLampAnimation);

        let content = document.createElement("div");
        content.classList.add("loadingScreenContent");
        this.loadingScreenContainer.appendChild(content);

        let loadingScreenMascot = document.createElement("object");
        loadingScreenMascot.type = "image/svg+xml";
        loadingScreenMascot.data = MASCOT_TEXTURE;
        loadingScreenMascot.height = loadingScreenMascot.width = "128px";
        loadingScreenMascot.classList.add("loaderMascot");
        content.appendChild(loadingScreenMascot);

        let loadingScreenHeadline = document.createElement("p");
        loadingScreenHeadline.id = "loadingScreenHeadline";
        loadingScreenHeadline.classList.add("loaderTextHeadline");
        loadingScreenHeadline.innerText = "DID YOU KNOW?";
        content.appendChild(loadingScreenHeadline);

        let loadingScreenText = document.createElement("p");
        loadingScreenText.id = "loadingScreenText";
        loadingScreenText.classList.add("loaderText");
        loadingScreenText.innerText = RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)];
        content.appendChild(loadingScreenText);
    }

    /**
     * Initializes the canvas DOM element 
     */
    private initializeCanvas(): void {
        this._renderCanvas.classList.add("renderCanvas");
        this._appContainer.appendChild(this._renderCanvas);
    }

    /**
     * Canvas element to render the scene on.
     * @type
     * HTMLCanvasElement
     */
    public get renderCanvas(): HTMLCanvasElement {
        return this._renderCanvas;
    }

    /**
     * Div element containing the loading screen. 
     * @type
     * HTMLDivElement
     */
    public get loadingScreenContainer(): HTMLDivElement {
        return this._loadingScreenContainer;
    }
}
