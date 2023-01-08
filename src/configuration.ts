import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { ASSET_PATH } from "./settings";

type Hotspot = {
    position: Vector2;
    target: Dome;
}

type Dome = {
    name: string;
    assetPath: string;
    resolution: Vector2;
    hotspots: Array<Hotspot>;
}

type Configuration = {
    corridor: Dome;
    mainHall: Dome;
    oldRoom: Dome;
}

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
