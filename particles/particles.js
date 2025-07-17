import * as THREE from 'three';

let particleSystem = null; // Store globally

export function setParticleSystem(system) {
	particleSystem = system;
}

export function createParticlesFromGeometry(mergedGeometry) {
	const posAttr = mergedGeometry.getAttribute('position');
	const basePositions = new Float32Array(posAttr.array.length);
	basePositions.set(posAttr.array);

	const colors = [];
	const sizes = new Float32Array(posAttr.count);
	for (let i = 0; i < posAttr.count; i++) {
		colors.push(1, 1, 1);
		sizes[i] = 5;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
	geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
	geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

	return geometry;
}

export async function createParticleMaterial() {
	const vertexShader = await (await fetch('shaders/shaderWave.vert')).text();
	const fragmentShader = await (await fetch('shaders/shaderWave.frag')).text();

	const texture = new THREE.TextureLoader().load('textures/sprites/disc.png');

	return new THREE.ShaderMaterial({
		uniforms: {
			color: { value: new THREE.Color(0xffffff) },
			pointTexture: { value: texture },
			alphaTest: { value: 0.9 }
		},
		vertexShader,
		fragmentShader,
		transparent: true
	});
}

export function updateParticles() {
	if (!particleSystem) return;

	// You can animate particle attributes here, like size/color/position
	// Example: worldToLocal use
	const center = new THREE.Vector3(0, 0, 0);
	particleSystem.worldToLocal(center);

	// Add your custom logic here if needed
}

export function addInteractivityListeners() {
	// Add any raycasting / hover / click logic here
}
