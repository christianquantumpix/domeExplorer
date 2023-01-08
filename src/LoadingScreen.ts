import { ILoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { RANDOM_FACTS } from "./randomFacts";

/**
 * Class for a custom loading screen. 
 */
export class LoadingScreen implements ILoadingScreen {
    loadingUIBackgroundColor: string;
    loadingUIText: string;
    private _loadingContainer: HTMLDivElement;
    private _loadingText: HTMLParagraphElement;

    /**
     * Creates a custom loading screen. 
     * 
     * @param loadingContainer DOM element to place the loading screen in. 
     * @param loadingtext Text to show on the loading UI. 
     */
    constructor(loadingContainer: HTMLDivElement, loadingText: HTMLParagraphElement) {
        this.loadingUIBackgroundColor = "";
        this.loadingUIText = "";
        this._loadingContainer = loadingContainer;
        this._loadingText = loadingText;
    }

    /**
     * Switches the text of the loading UI. 
     */
    switchText(): void {
        this._loadingText.innerText = RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)];
    }

    /**
     * Displays the loading UI. 
     */
    displayLoadingUI(): void {
        this.switchText();
        this._loadingContainer.classList.remove("loaded");
        this._loadingContainer.classList.add("loading");
    }

    /**
     * Hides the loading UI. 
     */
    hideLoadingUI(): void {
        this._loadingContainer.classList.remove("loading");
        this._loadingContainer.classList.add("loaded");
    };
}
