// curveTools/CurveMethods.js
import * as THREE from 'three';

export async function loadCurveFromJSON(scene, jsonPath) {
    try {
        const response = await fetch(jsonPath);
        const data = await response.json();

        if (!data.points || !Array.isArray(data.points)) {
            console.error('Spline JSON is missing valid "points" array.');
            return null;
        }

        const points = data.points
            .filter(p => p && typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number')
            .map(p => new THREE.Vector3(p.x, p.y, p.z));

        if (points.length < 2) {
            console.error("Not enough valid points to create a curve.");
            return null;
        }

        const curve = new THREE.CatmullRomCurve3(points, data.closed || false);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Line(geometry, material);

        return { curve, mesh };
    } catch (err) {
        console.error("Failed to load or parse spline path JSON:", err);
        return null;
    }
}
