import { MASCOT_TEXTURE } from "./configuration";

/**
 * Class for managing the creation of DOM elements for a domeExplorer instance.
 */
export class PageManager {
    private _appContainer: HTMLElement;
    private _renderCanvas: HTMLCanvasElement;
    private _loadingContainer: HTMLDivElement;
    private _loadingText: HTMLParagraphElement;
    private _isInitialized: boolean;

    /**
     * Manages the creation of DOM elements for a domeExplorer instance. 
     * 
     * @param appContainer div element to render the app instance in. 
     */
    constructor();
    constructor(appContainer?: HTMLDivElement) {
        this._appContainer = appContainer || document.body;
        this._renderCanvas = document.createElement("canvas");
        this._loadingContainer = document.createElement("div");
        this._loadingText = document.createElement("p");
        this._isInitialized = false;
    }

    /**
     * Initializes the page layout for the app. 
     * 
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
     * 
     * @remarks Avoids assigning id's to DOM elements for better readability. 
     */
    private initializeLoadingScreenContainer(): void {
        this._loadingContainer.classList.add("loadingScreenContainer");
        this._appContainer.appendChild(this._loadingContainer);

        let loadingLampAnimation = document.createElement("div");
        loadingLampAnimation.classList.add("loadingScreenLampAnimation");
        this._loadingContainer.appendChild(loadingLampAnimation);

        let content = document.createElement("div");
        content.classList.add("loadingScreenContent");
        this.loadingContainer.appendChild(content);

        let loadingMascot = document.createElement("object");
        loadingMascot.type = "image/svg+xml";
        loadingMascot.data = MASCOT_TEXTURE;
        loadingMascot.height = loadingMascot.width = "128px";
        loadingMascot.classList.add("loaderMascot");
        content.appendChild(loadingMascot);

        let loadingScreenHeadline = document.createElement("p");
        loadingScreenHeadline.id = "loadingScreenHeadline";
        loadingScreenHeadline.classList.add("loaderTextHeadline");
        loadingScreenHeadline.innerText = "DID YOU KNOW?";
        content.appendChild(loadingScreenHeadline);

        this._loadingText.id = "loadingScreenText";
        this._loadingText.classList.add("loaderText");
        content.appendChild(this._loadingText);
    }

    /**
     * Initializes the canvas DOM element. 
     */
    private initializeCanvas(): void {
        this._renderCanvas.classList.add("renderCanvas");
        this._appContainer.appendChild(this._renderCanvas);
    }

    /**
     * Canvas element to render the scene on.
     * 
     * @type HTMLCanvasElement
     */
    public get renderCanvas(): HTMLCanvasElement {
        return this._renderCanvas;
    }

    /**
     * Div element containing the loading screen. 
     * 
     * @type HTMLDivElement
     */
    public get loadingContainer(): HTMLDivElement {
        return this._loadingContainer;
    }

    /**
     * Paragraph element containing the random text string. 
     * 
     * @type HTMLParagraphElement
     */
    public get loadingText(): HTMLParagraphElement {
        return this._loadingText;
    }
}
