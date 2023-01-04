import { ILoadingScreen } from "babylonjs";

/**
 * Class for a custom loading screen. 
 */
export class LoadingScreen implements ILoadingScreen {
    loadingUIBackgroundColor: string;
    loadingUIText: string;
    loadingContainer: HTMLDivElement;

    /**
     * Creates a custom loading screen. 
     * 
     * @param loadingContainer dom element to place the loading screen in.
     */
    constructor(loadingContainer: HTMLDivElement) {
        this.loadingUIBackgroundColor = "";
        this.loadingUIText = "";
        this.loadingContainer = loadingContainer;
    }

    /**
     * Displays the loading UI. 
     */
    displayLoadingUI(): void {
        this.loadingContainer.classList.remove("loaded");
        this.loadingContainer.classList.add("loading");
    }

    /**
     * Hides the loading UI. 
     */
    hideLoadingUI(): void {
        this.loadingContainer.classList.remove("loading");
        this.loadingContainer.classList.add("loaded");
    };
}
