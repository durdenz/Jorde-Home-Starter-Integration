import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

import { getMixer } from '../js/helpers/ModelHelper.js';
import { loadCurveFromJSON } from './splineUtils.js';
import { handleScroll, updatePosition } from '../js/positionAlongPathTools/PositionAlongPathMethods2.js';
import { setupRenderer } from '../js/helpers/RendererHelper.js';
import PositionAlongPathState from '../js/positionAlongPathTools/PositionAlongPathState.js';

import {
	createParticlesFromGeometry,
	createParticleMaterial,
	addInteractivityListeners,
	updateParticles,
	setParticleSystem
} from './particles.js';

const startingModelPath = '../models/3DScene_TEST3.glb';
const curvePathJSON = '../models/SplinePath_TEST1.json';

async function loadSceneAsParticles(scene, path, camera) {
	const loader = new GLTFLoader();
	const gltf = await loader.loadAsync(path);

	const geometries = [];
	gltf.scene.traverse(child => {
		if (child.isMesh && child.geometry) {
			geometries.push(child.geometry.clone());
		}
	});

	if (geometries.length === 0) throw new Error("No mesh geometries found in GLB.");

	const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
	mergedGeometry.deleteAttribute('normal');
	mergedGeometry.deleteAttribute('uv');

	const geometry = createParticlesFromGeometry(mergedGeometry);
	const material = await createParticleMaterial();

	const particles = new THREE.Points(geometry, material);
	scene.add(particles);

	setParticleSystem(particles); // <--- important

	console.log("✅ Particles added to scene:", geometry.attributes.position.count);
	return particles;
}

setupScene();

async function setupScene() {
	const scene = new THREE.Scene();

	let mixer = getMixer();

	const curvePath = await loadCurveFromJSON(scene, curvePathJSON);
	if (!curvePath?.curve?.points?.length) {
		console.error("Invalid or empty curve loaded.");
		return;
	}

	const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.01, 5000);
	camera.position.copy(curvePath.curve.getPointAt(0));
	camera.lookAt(curvePath.curve.getPointAt(0.01));
	scene.add(camera);

	const renderer = setupRenderer();
	const positionAlongPathState = new PositionAlongPathState();

	const SplineCanvas = document.querySelector('#spline-path-canvas');

	window.addEventListener('wheel', (event) => {
		if (SplineCanvas.getBoundingClientRect().top <= 0) {
			handleScroll(event, positionAlongPathState);
		}
	}, false);

	addInteractivityListeners(); // optional

	await loadSceneAsParticles(scene, startingModelPath, camera);

	const clock = new THREE.Clock();

	function animate() {
		requestAnimationFrame(animate);
		updatePosition(curvePath, camera, positionAlongPathState);
		updateParticles();
		if (mixer) mixer.update(clock.getDelta());
		renderer.render(scene, camera);
	}

	animate();
	renderer.setAnimationLoop(animate);
}



const circle = document.getElementById('cursor-circle');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

// Listener to capture pointer movement
document.addEventListener('pointermove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animate loop with easing for "lazy" follow
function moveCircle() {
  const ease = 0.12;
  currentX += (mouseX - currentX) * ease;
  currentY += (mouseY - currentY) * ease;

  circle.style.left = `${currentX}px`;
  circle.style.top = `${currentY}px`;

  requestAnimationFrame(moveCircle);
}

moveCircle();



