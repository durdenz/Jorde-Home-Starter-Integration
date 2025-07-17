import * as THREE from 'three'; // G4 062925 Added for Animation
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let mixer; // G4 062925 Added for Animation

export const LoadGLTFByPath = (scene, startingModelPath) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(startingModelPath, (gltf) => {

        scene.add(gltf.scene);

        resolve();
      }, undefined, (error) => {
        reject(error);
      });
    });
};

// export const LoadGLBByPath = (scene, startingModelPath) => {
//   return new Promise((resolve, reject) => {
//     // Create a loader
//     const loader = new GLTFLoader();

//     // Load the GLTF file
//     loader.load(startingModelPath, (glb) => {

//       scene.add(glb.scene);

//       resolve();
//     }, undefined, (error) => {
//       reject(error);
//     });
//   });
// };

// G4 062925 Integrate code for animation
export const LoadGLBByPath = (scene, startingModelPath) => {
  return new Promise((resolve, reject) => {
    // Create a loader
    const loader = new GLTFLoader();

    // Load the GLTF file
    loader.load(startingModelPath, (glb) => {

      scene.add(glb.scene);

      // 062225 - G4 Beginning of Changes for Animation
      mixer = new THREE.AnimationMixer(glb.scene);
      const clips = glb.animations;

      // Play all animations at the same time
      clips.forEach(function(clip) {
          const action = mixer.clipAction(clip);
          action.play();
      });
      // 062225 - G4 End of Changes for Animation

      resolve();
    }, () => {}, (error) => {
      reject(error);
    });
  });
};

// 062225 - G4 Beginning of Changes for Animation
export const getMixer = () => {
  return(mixer);
};
// 062225 - G4 End of Changes for Animation