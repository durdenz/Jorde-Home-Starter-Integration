import * as THREE from "three";
import { getBody, getMouseBall } from "./getGravityBodies.js";
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth - 15; //GD5 Added this 7/5 because of window sizing issue
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.9, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: RapierCanvas });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit to 1.5x max - G4 072125 - Performance Item 3
// document.body.appendChild(renderer.domElement);

let mousePos = new THREE.Vector2();
await RAPIER.init();
const gravity = { x: 0.0, y: 0, z: 0.0 };
const world = new RAPIER.World(gravity);

// post-processing
const renderScene = new RenderPass(scene, camera);
// resolution, strength, radius, threshold
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.0, 0.005); // G4 072425 Performance Item 2
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const numBodies = 20;
const bodies = [];
for (let i = 0; i < numBodies; i++) {
  const body = getBody(RAPIER, world);
  bodies.push(body);
  scene.add(body.mesh);
}

const mouseBall = getMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);





const rectLight = new THREE.RectAreaLight( 0xffffff, 3,  3, 3 );
rectLight.position.set( 0, 5, 0.2 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )


function animate() {
  requestAnimationFrame(animate);
  world.step();
  mouseBall.update(mousePos);
  bodies.forEach(b => b.update());
  composer.render(scene, camera);
}

// G4 072425 Performance Item 
function isInViewPort(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
const elRapierCanvas = document.getElementById("RapierCanvas");
const isAnimatingRapier = false;

window.addEventListener('scroll', () => {
  if (isInViewPort(elRapierCanvas) && !isAnimatingRapier) {
    animate()
    isAnimatingRapier = true;
  } else if (isAnimatingRapier) {
    renderer.setAnimationLoop(null);
    isAnimatingRapier = false;
  }
});
// G4 072425 End of Performance Item
animate();
isAnimatingRapier = true;

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

function handleMouseMove (evt) {
  mousePos.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(evt.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', handleMouseMove, false);