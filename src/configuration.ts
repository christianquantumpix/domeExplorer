import { Vector2 } from "babylonjs";

// Paths: 
export const ASSET_PATH = '/';
export const VIEWPOINT_TEXTURE = ASSET_PATH + "textures/UI/button.png";
export const VIEWPOINT_ACTIVE_TEXTURE = ASSET_PATH + "textures/UI/buttonActive.png";

// Scaling: 
export const DOME_DIAMETER = 1000;
export const BUTTON_DISTANCE = DOME_DIAMETER * .45;
export const BUTTON_SIZE = DOME_DIAMETER * .1;

// Camera: 
export const FOV_HORIZONTAL = Math.PI * .4;

// Color palette: 
export const COLOR_MAIN = "#367496";
export const COLOR_SECONDARY_DARK = "#3F352C";
export const COLOR_SECONDARY_LIGHT = "#BCA089";
export const COLOR_TERTIARY = "#FFC14D";
export const COLOR_BLACK = "#000000";
export const COLOR_WHITE = "#FFFFFF";

// UI: 
export const CAPTION_SIZE = "18px";
export const TEXT_SIZE = "16px";
export const UI_ALPHA = 1;
export const TOOLTIP_Y = -192;

// Messages: 
export const MESSAGE_WELCOME = "Welcome to the dome explorer! \n Use the mouse to look around and click on a target to move to another view point. ";

// Dome presets: 
export const DOME_CONFIGURATION = {
    corridor: {
        name: "Corridor",
        assetPath: ASSET_PATH + "textures/corridor.webp",
        resolution: new Vector2(4096, 2048),
        hotspots: [
            {position: new Vector2(430, 1520), target: "mainHall"},
            {position: new Vector2(3360, 1260), target: "oldRoom"}
        ]
    },
    mainHall: {
        name: "Main hall",
        assetPath: ASSET_PATH + "textures/mainHall.webp",
        resolution: new Vector2(4096, 2048),
        hotspots: [
            {position: new Vector2(1400, 1250), target: "corridor"},
        ]
    },
    oldRoom: {
        name: "Old room",
        assetPath: ASSET_PATH + "textures/oldRoom.webp",
        resolution: new Vector2(4096, 2048),
        hotspots: [
            {position: new Vector2(440, 1350), target: "corridor"},
        ]
    }
};

export const DOME_STARTING_KEY = "corridor";
