import * as THREE from 'three';

export function geScreentDimension(camera, dimention) {
    const distance = camera.position.z;
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const height = 2 * Math.tan(vFOV / 2) * distance;
    const width = height * camera.aspect;
    return dimention == 'height' ? height : width;
}
