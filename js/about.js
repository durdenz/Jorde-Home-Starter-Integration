import * as THREE from 'three';
import { LoadGLTFByPath } from '../js/helpers/ModelHelper.js'
import { LoadGLBByPath } from '../js/helpers/ModelHelper.js'
import { getMixer } from '../js/helpers/ModelHelper.js' // G4 062925 Added for Animation
import PositionAlongPathState from '../js/positionAlongPathTools/PositionAlongPathState.js';
import { handleScroll, updatePosition } from '../js/positionAlongPathTools/PositionAlongPathMethods.js'
import { loadCurveFromJSON } from '../js/curveTools/CurveMethods.js'
import { setupRenderer } from '../js/helpers/RendererHelper.js'
import {IsMobile, IsTablet} from '../js/mobileCheck.js';

// G4 071125 - Canvas Size Issue - Selectively remove About Page top DOM elements
let rElems = [];
rElems.forEach((e) => {document.getElementById(e).remove()});

// console.log('Startup: window.innerWidth = '+window.innerWidth);
// console.log('Startup: particle.offsetWidth = '+document.getElementById("particle").offsetWidth);
// console.log('Startup: xHeader.offsetWidth = '+document.getElementById("xHeader").offsetWidth);
// console.log('Startup: designTree.offsetWidth = '+document.getElementById("designTree").offsetWidth);
// console.log('Startup: xFooter.offsetWidth = '+document.getElementById("xFooter").offsetWidth);


// G4 062925 Integrated
// Force Window to reset to position (0,0) on reload
window.addEventListener('load', (event) => {
  window.scrollTo({
    top: 0,
    left: 0,
    // behavior: 'smooth',
  });
});
// 062925 - End Of Changes

// Test for Mobile or Tablet Browser and update classes
if (IsMobile) { 
  console.log(`Mobile Browser Detected`);
} else if (IsTablet) {
  console.log(`Tablet Browser Detected`);
} else {
  console.log(`Desktop Browser Detected`);
}

//Open/Close Menu On Click
let menuState = 0; //0 = Closed

document.getElementById("hamburger").addEventListener("click", menuToggle);

function menuToggle() {
  console.log("X Clicked");
  var x = document.getElementById("box-nav-menu");
  if (menuState == 0) {
    x.classList.remove("box-nav-close");
    x.classList.add("box-nav"); 
    menuState = 1; //Menu Is Now Open
  } else {
    x.classList.remove("box-nav");
    x.classList.add("box-nav-close");
    menuState = 0; //Menu Is Now Closed
  }
}





// G4 071125 - Debug About Size Issue
// //GSAP and SplitType

// const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// // Change to false to make the animations play when the section's in viewport
// const scrub = true;
// document.addEventListener("DOMContentLoaded", (event) => {
//   gsap.registerPlugin(ScrollTrigger)

//   if(isAnimationOk) {
//     setupAnimations();
// }})

// function setupAnimations() {

// const splitTypes = document.querySelectorAll('.reveal-type')

// splitTypes.forEach((char,i) => {

//     const text = new SplitType(char,{ types: 'words, chars'})

//     gsap.from(text.words, {
//        scrollTrigger: {
//            trigger: char,
//            start: 'bottom 90%',
//            end: 'bottom 85%',
//            scrub: false,
//            markers: false,
//            toggleActions: 'play play reverse reverse'
//        },
//        stagger: 0.05,
//        opacity: 0,
//        y:90,
//        transformOrigin: 'bottom',
//        duration: 0.3,
//     })
// })

// // G4 071025 CleanUp for About Page
// // gsap.from(".line", {
// //   scrollTrigger: {
// //       trigger: ".line",
// //       start: 'bottom 90%',
// //       end: 'bottom 85%',
// //       scrub: false,
// //       markers: false,
// //       toggleActions: 'play play reverse reverse'
// //   },
// //   stagger: 0.05,
// //   opacity: 0,
// //   scaleX: 0,
// //   x:-90,
// //   transformOrigin: 'left',
// //   duration: 0.3,
// // })

// // G4 071025 CleanUp for About Page
// // gsap.from(".text-block-animate", {
// //   scrollTrigger: {
// //       trigger: ".line",
// //       start: 'bottom 90%',
// //       end: 'bottom 85%',
// //       scrub: false,
// //       markers: false,
// //       toggleActions: 'play play reverse reverse'
// //   },
// //   stagger: 0.05,
// //   opacity: 0,
// //   y:-90,
// //   transformOrigin: 'left',
// //   duration: 0.3,
// // })

// // G4 071025 CleanUp for About Page
// // gsap.from(".case-study-animate", {
// //   scrollTrigger: {
// //       trigger: ".case-study-animate",
// //       start: 'bottom 90%',
// //       end: 'bottom 85%',
// //       scrub: false,
// //       markers: false,
// //       toggleActions: 'play play reverse reverse'
// //   },
// //   stagger: 0.05,
// //   opacity: 0,
// //   y: 200,
// //   scale: 0,
// //   rotate: -45,
// //   transformOrigin: 'center right',
// //   duration: 0.3,
// // })


// var sections = gsap.utils.toArray('.case-study-animate2');

// sections.forEach((section) => {
//   gsap.from(section, {
//     scrollTrigger: {
//       trigger: section,
//       start: 'bottom 90%',
//       end: 'bottom 85%',
//       scrub: false,
//       markers: false,
//       toggleActions: 'play play reverse reverse'
//     },
//     opacity: 0,
//     y: 200,
//     scale: 0,
//     rotate: 25,
//     transformOrigin: '40% 40%',
//     duration: 0.4,
//   });
// });


// }

// const splitTypes = document.querySelectorAll('.reveal-type2')

// splitTypes.forEach((char,i) => {

//     const text = new SplitType(char,{ types: 'words, chars'})

//     gsap.from(text.words, {
//        stagger: 0.05,
//        opacity: 0,
//        y:-90,
//        transformOrigin: 'top',
//        duration: 0.2,
//        delay: 0.3,
//     })

//     gsap.to(text.chars, {
//       scrollTrigger: {
//         trigger: ".reveal-type2",
//           start: 'top 30%',
//           end: 'top 20%',
//           scrub: false,
//           markers: false,
//           toggleActions: 'play play reverse reverse'
//       },
//       stagger: 0.02,
//       opacity: 0,
//       y:90,
//       transformOrigin: 'bottom',
//       duration: 0.2,
//    })


// const splitTypes = document.querySelectorAll('.reveal-type3')

// splitTypes.forEach((char,i) => {

//     const text = new SplitType(char,{ types: 'words, chars'})

//     gsap.from(text.words, {
//        scrollTrigger: {
//            trigger: char,
//            start: 'bottom 50%',
//            end: '+=100%',
//            scrub: false,
//            pin: true,
//            markers: false,
//            ease: "back.inOut(1.7)",
//            toggleActions: 'play play play reverse'
//        },
//        stagger: 0.05,
//        opacity: 0,
//        x:90,
//        transformOrigin: 'bottom',
//        duration: 0.3,
//     })

//     gsap.to(text.chars, {
//       scrollTrigger: {
//           trigger: char,
//           start: 'top 35%',
//           end: 'top 35%',
//           scrub: false,
//           markers: false,
//           ease: "back.inOut(1.7)",
//           toggleActions: 'play play reverse reverse'
//       },
//       stagger: 0.05,
//       opacity: 0,
//       x:90,
//       transformOrigin: 'bottom',
//       duration: 0.3,
//    })

// })

// })

// G4 071025 CleanUp for About Page
// gsap.from(".keyhole", {
//   "clip-path": "polygon(0% 0%, 0% 100%, 49% 100%, 49% 25%, 49% 25%, 49% 75%, 49% 75%, 49% 100%, 100% 100%, 100% 0%)",
//   scrollTrigger: {
//     trigger: ".section5",
//     start: "1% 10%", // when the top of the trigger hits the top of the viewport
//     end: "10% 0%", // bottom of the trigger hits the bottom of the vp
//     scrub: scrub,
//     markers: false,
//     toggleActions: 'play play reverse reverse'
//   },
// })

// // ==============================================
// // Spline Path Follow Code Starts Here

// // G4 062925 Use new models for animation
// const startingModelPath = '../models/3DScene_TEST1.glb' // G4 062925 Added for Animation
// const curvePathJSON = '../models/SplinePath_TEST1.json' // G4 062925 Added for Animation

// setupScene();

// async function setupScene() {

// 	//Scene is container for objects, cameras, and lights
// 	const scene = new THREE.Scene();

//   await LoadGLBByPath(scene, startingModelPath); // G4 062925 Integrate Animtion
// 	let mixer = getMixer(); // G4 062925 Integrate Animtion

// 	let curvePath = await loadCurveFromJSON(scene, curvePathJSON);

// 	// Comment to remove curve visualization
// 	// scene.add(curvePath.mesh); 
	
// 	// Create a camera and set its position and orientation
// 	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 	// camera.position.set(6, 3, 10);
// 	camera.position.copy(curvePath.curve.getPointAt(0))
// 	camera.lookAt(curvePath.curve.getPointAt(0.99))

// 	// Add the camera to the scene
// 	scene.add(camera);
// 	const renderer = setupRenderer();

// 	let positionAlongPathState = new PositionAlongPathState();

//   // G4 062925 Integrated Code to isolate scroll thru scene to when top of canvas reaches top of viewport

//   // Setup Event Listener for Scrolling inside canvas
// 	let SplineCanvas = document.querySelector('#spline-path-canvas');

// 	window.addEventListener('wheel', onMouseScroll, false);

// 	function onMouseScroll(event){
// 		if(SplineCanvas.getBoundingClientRect().top <= 0) {
// 			// console.log(`MouseScroll: SplineCanvas.top = ${SplineCanvas.getBoundingClientRect().top}`);
// 			handleScroll(event, positionAlongPathState);
// 		}
// 	}
//   // G4 062925 End of Changes

//   // 062925 - G4 Beginning of Changes for Animation
// 	const clock = new THREE.Clock();
// 	// 062925 - G4 End of Changes for Animation

// 	// Animate the scene
// 	function animate() {
// 		requestAnimationFrame(animate);
// 		updatePosition(curvePath, camera, positionAlongPathState);
//     // 062925 - G4 Beginning of Changes for Animation
// 		if(mixer) {
//         	mixer.update(clock.getDelta());
// 		}
// 		// 062925 - G4 End of Changes for Animation
// 		renderer.render(scene, camera);
// 	}
// 	animate();

//   // 062925 - G4 Beginning of Changes for Animation
// 	renderer.setAnimationLoop(animate);
//   // 062925 - G4 End of Changes for Animation


// // Spline Path Follow Code Ends Here
// // ==============================================


//   // GD5 Added handleWindowResize and Event Listener 053125 
//   //
  
//   function handleWindowResize () {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     console.log("Window Resize "+window.innerWidth+" x "+window.innerHeight);
//   }
//   window.addEventListener('resize', handleWindowResize, false);


// };


// // Lottie Animation Arrow
// // ==============================================

import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

const btn1canvas = document.getElementById("dlBtn1"); // Select canvas by ID

const LottieButton1 = new DotLottie({
    canvas: btn1canvas,
    src: "./Compress_X_1.json", // json file
    renderer: "svg",
    loop: false,
    autoplay: false
});


let btn1pause = 24; // Pause Frame in animation
let btn1end = 60;  // Last Frame in animation

// G4 061625 - Start Changes to address hamburger animation
//
// 1 - Removed mouseenter functionality
// 2 - Added Btn1ClickState to track button status
// 3 - Added Logic to click handler to animate the hamburger forward or reverse
// 4 - Removed mouseleave functionality

function Btn1Hover() {
    // LottieButton1.setSegment(1, btn1pause);
    // LottieButton1.play();
}

let Btn1ClickState = 0;

function Btn1Click() {
    // LottieButton1.setSegment(btn1pause, btn1end);
      if (Btn1ClickState == 0) {
        LottieButton1.setMode("forward");
        LottieButton1.setSegment(1, btn1pause);
        LottieButton1.play();
        Btn1ClickState = 1;
        console.log("Menu Opened - Btn1ClickState = "+Btn1ClickState);
    } else {
        LottieButton1.setMode("reverse");
        LottieButton1.setSegment(1, btn1pause);
        LottieButton1.play();
        Btn1ClickState = 0;
        console.log("Menu Closed - Btn1ClickState = "+Btn1ClickState);
      }
}

function Btn1Exit() {
  // LottieButton1.playSegments(1, 24);
  // LottieButton1.setDirection(-1);
  // LottieButton1.play();
}

// G4 061625 End of Changes

btn1canvas.addEventListener("mouseenter", Btn1Hover);
btn1canvas.addEventListener("click", Btn1Click);
btn1canvas.addEventListener("mouseleave", Btn1Exit);


// G4 071025 CleanUp for About Page
// // Pin Section During Scroll Home Page Spline
// // ==============================================


// document.addEventListener("DOMContentLoaded", () => {
//   const header = document.getElementById("spline-path-canvas");
//   const s4 = document.getElementById("section4");
//   const scrollThreshold = 2800; // px

  // GD4 Commented out the folloeing code and added new code below 052825
  //     Also added const s4 above to grab bottom of Section4 
  //

  // window.addEventListener("scroll", () => {
  //   if (window.scrollY > scrollThreshold) {
  //     header.classList.add("sticky");
  //     header.classList.remove("nosticky"); // Optional
  //     console.log("window.scrollY: "+window.scrollY);
  //   } else {
  //     header.classList.remove("sticky");
  //     header.classList.add("nosticky");
  //   }
  // });

  // G4 071025 CleanUp for About Page
//   window.addEventListener("scroll", () => {
//     let s4rect = s4.getBoundingClientRect();
//     if (s4rect.bottom <= 0) {
//       header.classList.add("sticky");
//       header.classList.remove("nosticky"); // Optional
//     } else {
//       header.classList.remove("sticky");
//       header.classList.add("nosticky");
//     }
//   });
// });


// G4 071425 - CleanUp - Remove Unused Functions not used by about.html
// 
// // Case Study Year Update on Scroll
// // ==============================================

// document.addEventListener("DOMContentLoaded", () => {
//   const yearSpan = document.getElementById("activeYear");
//   const sections = document.querySelectorAll(".year-section");

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         const year = entry.target.dataset.year;
//         yearSpan.textContent = year;
//       }
//     });
//   }, {
//     threshold: 0.1 // Adjust as needed (0.1 means 10% of the section is visible)
//   });

//   sections.forEach(section => observer.observe(section));
// });


// G4 Added 052825
// G4 Modified 062825
// ---- Update Element Corner Data in Hero Section
// 
// G4 071025 About Page CleanUp
// let heroElement = document.getElementById("heroSection");
// let TLspan = document.getElementById("TLSpan");
// let BLspan = document.getElementById("BLSpan");
// let TRspan = document.getElementById("TRSpan");
// let BRspan = document.getElementById("BRSpan");

// function updateHeroDimensions() {
//   let rect = heroElement.getBoundingClientRect();
//   let heroTop = rect.top.toFixed(2);
//   let heroBottom = rect.bottom.toFixed(2);
//   let heroRight = rect.right.toFixed(2);
//   let heroLeft = rect.left.toFixed(2);

//   // console.log("top: "+rect.top+" , bottom: "+rect.bottom+" , left: "+rect.left+" , right "+rect.right);

//   TLspan.innerHTML = '(' + heroLeft + ',' + heroTop + ')';
//   BLspan.innerHTML = '(' + heroLeft + ',' + heroBottom + ')';
//   TRspan.innerHTML = '(' + heroRight + ',' + heroTop + ')';
//   BRspan.innerHTML = '(' + heroRight + ',' + heroBottom + ')';
// }

// document.addEventListener('scroll', updateHeroDimensions);

// document.getElementsByTagName("BODY")[0].onload = function() {updateHeroDimensions()};

// document.getElementsByTagName("BODY")[0].onresize = function() {updateHeroDimensions()};



// G5 Added 053125
// ---- Scramble Text on Hover
// 
document.querySelectorAll('.scramble-hover').forEach(element =>
  {
      let randomChars = "abcdefghijklmnopqrtsuvwxyz";
      let originalText = element.dataset.text;
  
      element.addEventListener('mouseover',() => {
          let iterations = 0;
          let interval = setInterval(() => {
              element.textContent = originalText.split("").map
              ((char,index) => {
                  if (index < iterations) return char;
                  return randomChars.charAt(Math.floor(Math.random
                  () * randomChars.length));
              })
              .join("");
              if( iterations >= originalText.length){
                  clearInterval(interval);
              }
              iterations += 1 / 1;
          },60)
      })
  })

  

// G5 Added 053125
// ---- Pixelation Overlay on Hover
// 
  document.addEventListener('DOMContentLoaded', function () {
    const animationStepDuration = 0.3; // Adjust this value to control the timing
    const gridSize = 17; // Number of pixels per row and column (adjustable)
    // Calculate pixel size dynamically
    const pixelSize = 100 / gridSize; // Calculate the size of each pixel as a percentage
    // Select all cards
    const cards = document.querySelectorAll('[data-pixelated-image-reveal]');
    // Detect if device is touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    // Loop through each card
    cards.forEach((card) => {
      const pixelGrid = card.querySelector('[data-pixelated-image-reveal-grid]');
      const activeCard = card.querySelector('[data-pixelated-image-reveal-active]');
      // Remove any existing pixels with the class 'pixelated-image-card__pixel'
      const existingPixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
      existingPixels.forEach(pixel => pixel.remove());
      // Create a grid of pixels dynamically based on the gridSize
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const pixel = document.createElement('div');
          pixel.classList.add('pixelated-image-card__pixel');
          pixel.style.width = `${pixelSize}%`; // Set the pixel width dynamically
          pixel.style.height = `${pixelSize}%`; // Set the pixel height dynamically
          pixel.style.left = `${col * pixelSize}%`; // Set the pixel's horizontal position
          pixel.style.top = `${row * pixelSize}%`; // Set the pixel's vertical position
          pixelGrid.appendChild(pixel);
        }
      }
      const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
      const totalPixels = pixels.length;
      const staggerDuration = animationStepDuration / totalPixels; // Calculate stagger duration dynamically
      let isActive = false; // Variable to track if the card is active
      let delayedCall;
      const animatePixels = (activate) => {
        isActive = activate;
        gsap.killTweensOf(pixels); // Reset any ongoing animations
        if (delayedCall) {
          delayedCall.kill();
        }
        gsap.set(pixels, { display: 'none' }); // Make all pixels invisible instantly
        // Show pixels randomly
        gsap.to(pixels, {
          display: 'block',
          duration: 0,
          stagger: {
            each: staggerDuration,
            from: 'random'
          }
        });
        // After animationStepDuration, show or hide the activeCard
        delayedCall = gsap.delayedCall(animationStepDuration, () => {
          if (activate) {
            activeCard.style.display = 'block';
            // **Set pointer-events to none so clicks pass through activeCard**
            activeCard.style.pointerEvents = 'none';
          } else {
            activeCard.style.display = 'none';
          }
        });
        // Hide pixels randomly
        gsap.to(pixels, {
          display: 'none',
          duration: 0,
          delay: animationStepDuration,
          stagger: {
            each: staggerDuration,
            from: 'random'
          }
        });
      };
      if (isTouchDevice) {
        // For touch devices, use click event
        card.addEventListener('click', () => {
          animatePixels(!isActive);
        });
      } else {
        // For non-touch devices, use mouseenter and mouseleave
        card.addEventListener('mouseenter', () => {
          if (!isActive) {
            animatePixels(true);
          }
        });
        card.addEventListener('mouseleave', () => {
          if (isActive) {
            animatePixels(false);
          }
        });
      }
    });
  });



  // const elements = document.querySelectorAll(".hoverText1");

  // elements.forEach((element) => {
  //   const hoverTween = gsap.from(element, { 
  //     x: -40, 
  //     duration: 0.4, 
  //     ease: "power1.inOut",
  //     stagger: 0.05,
  //     transformOrigin: 'left',
  //     paused: true 
  //   });
  
  //   element.addEventListener("mouseenter", () => {
  //     hoverTween.play();
  //   });
  
  //   element.addEventListener("mouseleave", () => {
  //     hoverTween.reverse();
  //   });
  // });
  



// Target all .cs-animate-text panels
document.querySelectorAll('.cs-animate-text').forEach((panel) => {
  const dateEl = panel.querySelector('.csdate'); // h1
  const titleEl = panel.querySelector('h1.case-title'); // h1
  const arrow = panel.querySelector('span.case-title'); // span arrow
  const tagLinks = panel.querySelectorAll('.tags a'); // all <a> tags

  // Apply SplitType to each text element
  const splitDate = new SplitType(dateEl, { types: 'words, chars' });
  const splitTitle = new SplitType(titleEl, { types: 'words, chars' });
  
  // Store all tag word elements
  const splitTags = [];
  tagLinks.forEach(tag => {
    const splitTag = new SplitType(tag, { types: 'words, chars' });
    splitTags.push(...splitTag.words); // collect all split words
  });

  // Combine all words for animation
  const allWords = [
    ...splitDate.words,
    ...splitTitle.words,
    ...splitTags
  ];

  // Build the ScrollTrigger timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: 'top 90%',
      end: 'top 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
    }
  });

  // Animate all words (date, title, and tags)
  tl.from(allWords, {
    opacity: 0,
    y: 50,
    stagger: 0.05,
    duration: 0.3,
    ease: 'power2.out'
  });

  // Animate arrow separately
  tl.to(arrow, {
    opacity: 0,
    x: -100,
    duration: 0.3
  }, ">");
});


const elements = document.querySelectorAll(".hoverText1");

elements.forEach((element) => {
  const arrow = element.querySelector("span.case-title");
  const title = element.querySelector("h1.case-title");

  let hoverTween; // We'll recreate this on init + resize

  const createHoverTween = () => {
    // Kill existing timeline if it exists
    if (hoverTween) hoverTween.kill();

    const offset = () => Math.min(Math.max(window.innerWidth * 0.03, 30), 600);

    hoverTween = gsap.timeline({ paused: true })
    .fromTo(
      arrow,
      { x: -offset(), opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: "power1.inOut" }
    )
    .fromTo(
      title,
      { x: 0, opacity: 1 },
      { x: offset(), opacity: 1, duration: 0.4, ease: "power1.inOut" },
      "<0.05"
    );
  };

  // Initial creation
  createHoverTween();

  // Rebuild on resize (debounced for performance)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createHoverTween();
    }, 150); // Wait 150ms after resize ends
  });

  element.addEventListener("mouseenter", () => hoverTween.play());
  element.addEventListener("mouseleave", () => hoverTween.reverse());
});
