import { ILoadingScreen } from "babylonjs";

export class LoadingScreen implements ILoadingScreen {
    loadingUIBackgroundColor: string;
    loadingUIText: string;
    loadingContainer: HTMLDivElement;

    constructor(loadingContainer: HTMLDivElement) {
        this.loadingUIBackgroundColor = "";
        this.loadingUIText = "";
        this.loadingContainer = loadingContainer;
    }

    displayLoadingUI(): void {
        this.loadingContainer.classList.remove("loaded");
        this.loadingContainer.classList.add("loading");
    }

    hideLoadingUI(): void {
        this.loadingContainer.classList.remove("loading");
        this.loadingContainer.classList.add("loaded");
    };
}
