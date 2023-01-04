import { Vector2, Vector3 } from "babylonjs";

/**
 * Function to get a position in 3D space from pixel coordinates on a dome texture. 
 * 
 * @param position target pixel coordinates. 
 * @param resolution texture resolution. 
 * @param distance target distance from the origin. 
 * 
 * @returns position in 3D space. 
 */
export function getPositionFromPixelPosition(position: Vector2, resolution: Vector2, distance: number): Vector3 {
    // Simplify this desease of a formula.
    let positionX = Math.cos(-2 * Math.PI * position.x / resolution.x);
    let positionZ = Math.sin(-2 * Math.PI * position.x / resolution.x);

    let positionY = Math.sin(Math.PI * (.5 - position.y / resolution.y));

    // Scaling factor to normalize
    let scalingFactor = Math.cos(Math.PI * (.5 - position.y / resolution.y));
    positionX *= scalingFactor;
    positionZ *= scalingFactor;

    let position3D = new Vector3(positionX, positionY, positionZ);

    position3D.scaleInPlace(distance);

    return position3D;
}
