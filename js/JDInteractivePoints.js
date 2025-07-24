import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js'; // G4 062725

import { EffectComposer } from 'https://unpkg.com/three@0.150.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.150.1/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.150.1/examples/jsm/postprocessing/UnrealBloomPass.js';


// let wC = 0;  //Adjusment for screen width issues
// let wW = window.innerWidth;
// if (wW <= 600) {wC = .972}
// else if (wW <= 1000) {wC = .975}
// else {wC = .985}

let renderer, scene, camera;

let cursorLight;

let modelGroup;

let particles;

const PARTICLE_SIZE = 10;

let raycaster, intersects;
let pointer, INTERSECTED;
let fragmentshader, vertexshader;

let composer, renderPass, bloomPass;


await initShaders();
await init();

async function initShaders() {
    fragmentshader = await (await fetch('shaders/shader.frag')).text();
    vertexshader = await (await fetch('shaders/shader.vert')).text();
}

async function init() {

    const container = document.getElementById( 'particle' );

    const width = container.clientWidth;
    const height = container.clientHeight;


    console.log("Particle - GrabDOM: Windows.innerWidth = "+window.innerWidth); //G4 071125 - Debug About Width Issue
    console.log('Particle - GrabDOM: particle.offsetWidth = '+document.getElementById("particle").offsetWidth);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.z = 220;
    camera.position.y = 0;

    // G5 062925
    // cursorLight = new THREE.PointLight(0xffffff, 1, 500);
    // cursorLight.position.z = 20; // initial Z
    // scene.add(cursorLight);

    cursorLight = new THREE.PointLight(0xffffff, 1000, 300);
    cursorLight.position.set(50, 50, 50); // closer to mesh

    scene.add(cursorLight);
    
    // Add glowing sphere as a helper/visual marker
    // const lightHelper = new THREE.Mesh(
    //     new THREE.SphereGeometry(0.25, 16, 16),
    //     new THREE.MeshStandardMaterial({
    //       color: 0xffffaa,
    //       emissive: 0xffffaa,
    //       emissiveIntensity: 1.5
    //     })
    //   );
    //   cursorLight.add(lightHelper);

    //

    // G4 062725 Use GLB Geometry instead of BoxGeometry
    // let boxGeometry = new THREE.BoxGeometry( 200, 200, 200, 16, 16, 16 );
    //let boxGeometry = await getGLBGeometry();

    // Create a group to hold the mesh and particles together
    modelGroup = new THREE.Group();

    // Load native mesh (GLB)
    const nativeMesh = await loadGLBModel();
    modelGroup.add(nativeMesh); // Add the mesh to the group

    // Load second mesh (GLB)
    const secondMesh = await loadSecondGLBModel();
    secondMesh.position.set(0, 0, 0); // optional: space it out
    secondMesh.scale.set(1, 1, 1); // Scale it slightly smaller
    modelGroup.add(secondMesh);

    // Clone geometry for particles
    const particleGeometry = nativeMesh.geometry.clone();
    particleGeometry.deleteAttribute('normal');
    particleGeometry.deleteAttribute('uv');
    const boxGeometry = BufferGeometryUtils.mergeVertices(particleGeometry);

    // Use a consistent scale — apply it to the group
    modelGroup.scale.set(5, 5, 5);

    // Build particle system
    const positionAttribute = boxGeometry.getAttribute('position');

    const colors = [];
    const sizes = [];

    const color = new THREE.Color();
    for (let i = 0, l = positionAttribute.count; i < l; i++) {
        const lightness = Math.random(); // Random value between 0 (black) and 1 (white)
        color.setHSL(0, 0, lightness);   // Grayscale using saturation = 0
        color.toArray(colors, i * 3);
        sizes[i] = PARTICLE_SIZE * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: new THREE.TextureLoader().load('textures/sprites/disc.png') },
            alphaTest: { value: 0.9 },
        
            emissiveColor: { value: new THREE.Color(0xffffff) },   // example glow color
            emissiveIntensity: { value: 0.5 }                      // adjust for glow strength
        },
        
        vertexShader: vertexshader,
        fragmentShader: fragmentshader
    });

    particles = new THREE.Points(geometry, material);
    modelGroup.add(particles);

    // Add group to scene
    scene.add(modelGroup);



    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    
    
    renderer.setSize(width, height);
    
    console.log("Particle - Before Add to DOM: Windows.innerWidth = "+window.innerWidth); //G4 071125 - Debug About Width Issue
     console.log('Particle - Before Add to DOM: particle.offsetWidth = '+document.getElementById("particle").offsetWidth);
    container.appendChild(renderer.domElement);
    console.log("Particle - After Add to DOM: Windows.innerWidth = "+window.innerWidth); //G4 071125 - Debug About Width Issue
     console.log('Particle - After Add to DOM: particle.offsetWidth = '+document.getElementById("particle").offsetWidth);
    
    // Setup EffectComposer and passes
    composer = new EffectComposer(renderer);
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height), // <- use width/height
        1.5,
        0.4,
        0.85
    );
    composer.addPass(bloomPass);
    
    
    renderer.setAnimationLoop(animate);
    

    //

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    //

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(onWindowResize, 150);
    });
    
    document.addEventListener( 'pointermove', onPointerMove );

}

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {
    const container = document.getElementById('particle');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
    
}

function animate() {

    render();

}
// G5 062925 Interactive Particle Radius and transition
function render() {

    modelGroup.rotation.x += 0.0000;
    modelGroup.rotation.y += 0.001;

    const geometry = particles.geometry;
    const attributes = geometry.attributes;
    const positions = attributes.position;
    const sizes = attributes.size;

    const radius = 15;
    const lerpSpeed = 0.1; // Lower = smoother/slower transition

    // Step 1: Set all target sizes to default
    const targetSizes = new Float32Array(sizes.count).fill(PARTICLE_SIZE * 0.35);

    raycaster.setFromCamera(pointer, camera);
    intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {
        const intersectIndex = intersects[0].index;
        const intersectedPos = new THREE.Vector3().fromBufferAttribute(positions, intersectIndex);
        particles.localToWorld(intersectedPos);

        for (let i = 0; i < positions.count; i++) {
            const pos = new THREE.Vector3().fromBufferAttribute(positions, i);
            particles.localToWorld(pos);
        
            const distance = intersectedPos.distanceTo(pos);
        

            if (distance < radius) {
                const t = distance / radius;
                const falloff = Math.exp(-6 * t); // strong exponential falloff
                const scale = 0.75 + 0.5 * falloff; // boost scale range to be more visible

                targetSizes[i] = PARTICLE_SIZE * scale;
            }
        }
    }

    // Step 2: Smoothly interpolate current sizes to target sizes
    for (let i = 0; i < sizes.count; i++) {
        const current = sizes.array[i];
        const target = targetSizes[i];
    
        const speed = target > current ? 0.1 : 0.03; // faster in, slower out
        sizes.array[i] = THREE.MathUtils.lerp(current, target, speed);
    }

    // Project 2D pointer to a point in world space ~20px in front of camera
        const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5); // 0.5 is mid-depth in clip space
        vector.unproject(camera);

    // Direction from camera to projected point
        const dir = vector.sub(camera.position).normalize();

    // Set light ~20px from camera along the ray
        const distance = 20;
        const lightPosition = camera.position.clone().add(dir.multiplyScalar(distance));

        cursorLight.position.copy(lightPosition);

    sizes.needsUpdate = true;
    composer.render();

}

// G4 062725 Start GLB Load Section

let glbGeometry;

async function loadGLBModel() {
    const glbLoader = new GLTFLoader();
    const glbPath = "models/HEAD_TEST.glb";

    return new Promise((resolve, reject) => {
        glbLoader.load(
            glbPath,
            (gltf) => {
                let mesh;
                gltf.scene.traverse((child) => {
                    if (child.isMesh && !mesh) {
                        mesh = child.clone();

                        const originalMat = mesh.material;

                        mesh.material = new THREE.MeshStandardMaterial({
                            map: originalMat.map,                     // Base color texture
                            color: originalMat.color,                 // Color tint
                            metalness: 0.5,
                            roughness: 0.5,

                            // Emissive
                            emissive: new THREE.Color(0xffffff),
                            emissiveIntensity: 1.0,
                            emissiveMap: originalMat.map,

                            // Alpha support
                            transparent: true,
                            alphaTest: 0.5,                           // Optional, helps with clean edges
                            opacity: originalMat.opacity ?? 1.0      // Use original opacity if set
                        });

                        // If the original material had transparency explicitly enabled
                        if (originalMat.transparent) {
                            mesh.material.transparent = true;
                        }
                    }
                });

                if (mesh) {
                    resolve(mesh);
                } else {
                    reject("No mesh found in GLB");
                }
            },
            undefined,
            (error) => reject(error)
        );
    });
}

async function loadSecondGLBModel() {
    const glbLoader = new GLTFLoader();
    const glbPath = "models/HEAD_TEST2.glb";

    return new Promise((resolve, reject) => {
        glbLoader.load(
            glbPath,
            (gltf) => {
                let mesh;
                gltf.scene.traverse((child) => {
                    if (child.isMesh && !mesh) {
                        mesh = child.clone();

                        const originalMat = mesh.material;

                        mesh.material = new THREE.MeshStandardMaterial({
                            map: originalMat.map,                     // Base color texture
                            color: originalMat.color,                 // Color tint
                            metalness: 0.5,
                            roughness: 0.5,

                            // Emissive
                            emissive: new THREE.Color(0xffffff),
                            emissiveIntensity: 2.5,
                            emissiveMap: originalMat.map,

                            // Alpha support
                            transparent: originalMat.transparent || true,
                            alphaTest: 0.5,                           // Optional, helps with clean edges
                            opacity: originalMat.opacity ?? 1.0      // Use original opacity if set
                        });

                        // Optional: position or scale adjustments
                        mesh.position.x += 0;
                        mesh.scale.set(1, 1, 1);
                    }
                });

                if (mesh) {
                    resolve(mesh);
                } else {
                    reject("No mesh found in GLB 2");
                }
            },
            undefined,
            (error) => reject(error)
        );
    });
}







async function getGLBGeometry() {
  const size = 30.0;

  await loadGLBModel();

  const geo = glbGeometry.clone();
  geo.scale(size, size, size);

  return geo;
}

// G4 062725 End GLB Load Section



[...document.body.querySelectorAll("*")].forEach(el => {
    if (el.scrollWidth > document.documentElement.clientWidth) {
      console.warn("Overflowing element:", el);
    }
  });
  
