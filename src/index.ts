import { DomeExplorer } from "./DomeExplorer";
import { PageManager } from "./PageManager";

/**
 * The starting point of the application. 
 */
function main() {
    let pageManager = new PageManager();
    pageManager.init();
    
    let domeExplorer = new DomeExplorer(pageManager);
    domeExplorer.displayLoadingUI();

    domeExplorer.initScene();
    domeExplorer.beginRender();

    // window.setTimeout(() => {
    //     domeExplorer.hideLoadingUI();
    // }, 5000);
    domeExplorer.scene.executeWhenReady(() => domeExplorer.hideLoadingUI()); 
}

main();
