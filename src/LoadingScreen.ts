import { ILoadingScreen } from "babylonjs";
import { RANDOM_FACTS } from "./randomFacts";

/**
 * Class for a custom loading screen. 
 */
export class LoadingScreen implements ILoadingScreen {
    loadingUIBackgroundColor: string;
    loadingUIText: string;
    loadingContainer: HTMLDivElement;
    loadingText: HTMLParagraphElement;

    /**
     * Creates a custom loading screen. 
     * 
     * @param loadingContainer dom element to place the loading screen in.
     */
    constructor(loadingContainer: HTMLDivElement, loadingText: HTMLParagraphElement) {
        this.loadingUIBackgroundColor = "";
        this.loadingUIText = "";
        this.loadingContainer = loadingContainer;
        this.loadingText = loadingText;
    }

    switchText(): void {
        this.loadingText.innerText = RANDOM_FACTS[Math.floor(Math.random() * RANDOM_FACTS.length)];
    }

    /**
     * Displays the loading UI. 
     */
    displayLoadingUI(): void {
        this.switchText();
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
