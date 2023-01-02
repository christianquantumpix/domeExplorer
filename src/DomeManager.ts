import { PhotoDome, Scene, StandardMaterial, Texture } from "babylonjs";
import { ViewpointButton } from "./Button";
import { BUTTON_DISTANCE, BUTTON_SIZE, DOME_CONFIGURATION, DOME_DIAMETER, DOME_STARTING_KEY, VIEWPOINT_ACTIVE_TEXTURE, VIEWPOINT_TEXTURE } from "./configuration";
import { getPositionFromPixelPosition } from "./getPositionFromPixelPosition";
import { UIManager } from "./UIManager";

/**
 * Class for Managing the dome network. 
 */
export class DomeManager {
    private _scene: Scene;
    private _domeKey: keyof typeof DOME_CONFIGURATION;
    private _dome: PhotoDome;
    private _viewButtons: Array<ViewpointButton>;

    // This should probably happen somewhere else. 
    private _viewButtonsMaterial: StandardMaterial;
    private _viewButtonsMaterialActive: StandardMaterial;

    private _uiManager: UIManager;

    /**
     * Creates a dome manager instance. 
     * 
     * @param scene Scene element the dome structure will be attacheed to.
     */
    constructor(scene: Scene, uiManager: UIManager) {
        this._scene = scene;
        this._domeKey = DOME_STARTING_KEY;
        this._dome = new PhotoDome("dome", DOME_CONFIGURATION[this._domeKey].assetPath, {size: DOME_DIAMETER}, this._scene);
        this._viewButtons = [];
        this._viewButtonsMaterial = this._viewButtonsMaterialActive = new StandardMaterial("placeholder", this._scene);
        this._uiManager = uiManager;
    }

    /**
     * Initializes the materials for buttons. 
     */
    public initButtonMaterials(): void {
        this._viewButtonsMaterial.dispose();
        this._viewButtonsMaterialActive.dispose();

        var buttonMaterial = new StandardMaterial("viewButton", this._scene);
        var buttonMaterialActive = new StandardMaterial("viewButtonActive", this._scene);

        buttonMaterial.useAlphaFromDiffuseTexture = true;
        buttonMaterialActive.useAlphaFromDiffuseTexture = true;
        buttonMaterial.alpha = 0.75;
        buttonMaterialActive.alpha = 0.75;
        buttonMaterial.disableLighting = true;
        buttonMaterialActive.disableLighting = true;

        let texture = new Texture(VIEWPOINT_TEXTURE, this._scene, false, true, Texture.TRILINEAR_SAMPLINGMODE);
        let textureActive = new Texture(VIEWPOINT_ACTIVE_TEXTURE, this._scene, false, true, Texture.TRILINEAR_SAMPLINGMODE);
        texture.hasAlpha = true;
        textureActive.hasAlpha = true;
        texture.anisotropicFilteringLevel = 16;
        textureActive.anisotropicFilteringLevel = 16;

        buttonMaterial.diffuseTexture = texture;
        buttonMaterial.emissiveTexture = texture;
        buttonMaterialActive.diffuseTexture = textureActive;
        buttonMaterialActive.emissiveTexture = textureActive;

        this._viewButtonsMaterial = buttonMaterial;
        this._viewButtonsMaterialActive = buttonMaterialActive;
    }

    /**
     * A really disgusting implementation. 
     */
    public initDomeViewpoints(): void {
        // Remove the old set of viewpoint buttons. 
        for(var i = 0; i < this._viewButtons.length; i++) {
            this._viewButtons[i].dispose();
        }
        this._viewButtons.length = 0;

        // Set up new set of viewpoint buttons. 
        type keyType = keyof typeof DOME_CONFIGURATION;
        let currentDome = DOME_CONFIGURATION[this._domeKey];
        
        for(var j = 0; j < currentDome.hotspots.length; j++) {
            let buttonPosition = getPositionFromPixelPosition(currentDome.hotspots[j].position, currentDome.resolution, BUTTON_DISTANCE);
            
            let button = new ViewpointButton(
                "button", BUTTON_SIZE, this._scene, this._viewButtonsMaterial, this._viewButtonsMaterialActive, 
                buttonPosition, 
                this,
                DOME_CONFIGURATION[currentDome.hotspots[j].target as keyType].assetPath, //Try to avoid this casting.
                DOME_CONFIGURATION[this._domeKey].hotspots[j].target as keyType, // Try to avoid this casting. 
                DOME_CONFIGURATION[currentDome.hotspots[j].target as keyType].name, // Try to avoid this casting. 
                this._uiManager
            );

            // Add viewpoint button to the curent list of viewpoint buttons. 
            this._viewButtons.push(button);
        }
    }

    public get domeKey(): keyof typeof DOME_CONFIGURATION {
        return this._domeKey;
    }

    public set domeKey(key: keyof typeof DOME_CONFIGURATION) {
        this._domeKey = key;
    }
    
    public get dome(): PhotoDome {
        return this._dome;
    }
}
