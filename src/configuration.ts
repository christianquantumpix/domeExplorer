import { Vector2 } from "babylonjs";

export const COLOR_MAIN = "#893131";
export const COLOR_SECONDARY_DARK = "#3F352C";

export const UI_ALPHA = .75;
export const TOOLTIP_Y = -128;

export const ASSET_PATH = '/';

export const VIEWPOINT_TEXTURE = ASSET_PATH + "textures/button.png";
export const VIEWPOINT_ACTIVE_TEXTURE = ASSET_PATH + "textures/buttonActive.png";

export const DOME_DIAMETER = 1000;
export const BUTTON_DISTANCE = DOME_DIAMETER * .45;
export const BUTTON_SIZE = DOME_DIAMETER * .1;

export const FOV_HORIZONTAL = Math.PI * .4;

export const DOME_CONFIGURATION = {
    kitchen: {
        name: "Kitchen",
        assetPath: ASSET_PATH + "textures/brown_photostudio_06.webp",
        resolution: new Vector2(1560, 780),
        hotspots: [
            {position: new Vector2(260, 450), target: "bathroom"},
        ]
    },
    bathroom: {
        name: "Bathroom",
        assetPath: ASSET_PATH + "textures/brown_photostudio_07.webp",
        resolution: new Vector2(1560, 780),
        hotspots: [
            {position: new Vector2(600, 480), target: "kitchen"},
        ]
    }
};

export const DOME_STARTING_KEY = "kitchen";
