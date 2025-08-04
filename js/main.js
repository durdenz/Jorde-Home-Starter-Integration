import * as THREE from 'three';
import { LoadGLTFByPath } from '../js/helpers/ModelHelper.js'
import { LoadGLBByPath } from '../js/helpers/ModelHelper.js'
import { getMixer } from '../js/helpers/ModelHelper.js' // G4 062925 Added for Animation
import PositionAlongPathState from '../js/positionAlongPathTools/PositionAlongPathState.js';
import { handleScroll, updatePosition } from '../js/positionAlongPathTools/PositionAlongPathMethods.js'
import { loadCurveFromJSON } from '../js/curveTools/CurveMethods.js'
import { setupRenderer } from '../js/helpers/RendererHelper.js'
import {IsMobile, IsTablet, screenPortrait} from '../js/mobileCheck.js';


//G5 added 7/15 for unreal bloom pass on spline path
// NEED TO REMOVE IN FINAL CODE AND PUT IN SEPREATE JS. CAUSES ISSUES HERE!!!!
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";


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

// G4 072825 - Change video assets to Portrait based on screen 
if ('orientation' in screen) {
  console.log("Current Orientation: "+screen.orientation.type);
}

const PreviewVideo = document.getElementById("myPreviewVideo");
if (screenPortrait) {
  PreviewVideo.src = "./TempPortrait.mp4";
} else {
  PreviewVideo.src = "./Sandev Test.mp4";
}

screen.orientation.addEventListener('change', () => {
  window.location.reload();
});

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






//GSAP and SplitType

const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Change to false to make the animations play when the section's in viewport
const scrub = true;
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)

  if(isAnimationOk) {
    setupAnimations();
}})

function setupAnimations() {

const splitTypes = document.querySelectorAll('.reveal-type')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.words, {
       scrollTrigger: {
           trigger: char,
           start: 'bottom 90%',
           end: 'bottom 85%',
           scrub: false,
           markers: false,
           toggleActions: 'play play reverse reverse'
       },
       stagger: 0.05,
       opacity: 0,
       y:90,
       transformOrigin: 'bottom',
       duration: 0.3,
    })
})



gsap.from(".line", {
  scrollTrigger: {
      trigger: ".line",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  scaleX: 0,
  x:-90,
  transformOrigin: 'left',
  duration: 0.3,
})

gsap.from(".text-block-animate", {
  scrollTrigger: {
      trigger: ".reveal-type",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  y:-90,
  transformOrigin: 'left',
  duration: 0.3,
})



gsap.from(".case-study-animate", {
  scrollTrigger: {
      trigger: ".case-study-animate",
      start: 'bottom 90%',
      end: 'bottom 85%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
  },
  stagger: 0.05,
  opacity: 0,
  y: 200,
  scale: 0,
  rotate: -45,
  transformOrigin: 'center right',
  duration: 0.3,
})


var sections = gsap.utils.toArray('.case-study-animate2');

sections.forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: '10% 90%',
      end: 'top 90%',
      scrub: false,
      markers: false,
      toggleActions: 'play play reverse reverse'
    },
    opacity: 0,
    y: 200,
    scale: 0,
    rotate: 25,
    transformOrigin: '40% 40%',
    duration: 0.4,
  });
});


}

const splitTypes = document.querySelectorAll('.reveal-type2')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.words, {
       stagger: 0.05,
       opacity: 0,
       y:-90,
       transformOrigin: 'top',
       duration: 0.2,
       delay: 0.3,
    })

    gsap.to(text.chars, {
      scrollTrigger: {
        trigger: ".reveal-type2",
          start: 'top 30%',
          end: 'top 20%',
          scrub: false,
          markers: false,
          toggleActions: 'play play reverse reverse'
      },
      stagger: 0.02,
      opacity: 0,
      y:90,
      transformOrigin: 'bottom',
      duration: 0.2,
   })
   
   
   

})

gsap.registerPlugin(ScrollTrigger);

// Wait for DOM load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".reveal-type3").forEach((el) => {
    // Split text into characters
    const split = new SplitType(el, { types: "words, chars" });

    // Create a wrapper to preserve layout during pinning
    const wrapper = document.createElement("div");
    wrapper.classList.add("reveal-wrapper");

    // Measure height and add padding for animation (in/out movement)
    const elHeight = el.offsetHeight;
    const padding = 120; // Extra height for animation movement
    wrapper.style.height = `${elHeight + padding}px`;
    wrapper.style.position = "relative";
    wrapper.style.overflow = "visible";

    // Insert wrapper around element
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    // Style target element for positioning (use relative instead of absolute)
    Object.assign(el.style, {
      position: "relative",      // ⬅️ Prevents layout jump and disappearance
      top: "0",
      left: "0",
      width: "100%",
      zIndex: "1",
      textAlign: "center",
    });

    // ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top center",
        end: "+=500",
        scrub: true,
        pin: true,
        // toggleActions: 'play play reverse reverse', // for non scrub based
        pinSpacing: false,   // ⛔ prevent extra space from being added
        markers: true        // ✅ for debugging; disable in production
      }
    });

    // Animate in
    tl.from(split.chars, {
      opacity: 0,
      y: 60,
      stagger: 0.04,
      duration: 0.4,
      ease: "power2.out"
    });

    // Animate out
    tl.to(split.chars, {
      opacity: 0,
      y: -60,
      stagger: 0.04,
      duration: 0.4,
      ease: "power2.in"
    });
  });
});



// GD5 Added handleWindowResize and Event Listener 053125 
//
  gsap.from(".keyhole", {
    "clip-path": "polygon(0% 0%, 0% 100%, 50% 100%, 50% 25%, 50% 25%, 50% 75%, 50% 75%, 50% 100%, 100% 100%, 100% 0%)",    
    scrollTrigger: {
      trigger: ".section5",
      start: "7% 10%", // when the top of the trigger hits the top of the viewport
      end: "10% 0%", // bottom of the trigger hits the bottom of the vp
      scrub: true,
      markers: false,
      toggleActions: 'play play reverse reverse'
    },
  })

// ==============================================
// Spline Path Follow Code Starts Here

// G4 062925 Use new models for animation
const startingModelPath = '../models/WireFrame_Rotate_Test.glb'; // G4 062925 Added for Animation
const curvePathJSON = '../models/StraightSpline2.json'; // G4 062925 Added for Animation

setupScene();

async function setupScene() {
	const scene = new THREE.Scene();

	await LoadGLBByPath(scene, startingModelPath); // G4 062925 Integrate Animation
	let mixer = getMixer(); // G4 062925 Integrate Animation

	let curvePath = await loadCurveFromJSON(scene, curvePathJSON);

	// Optional: scene.add(curvePath.mesh);

	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.copy(curvePath.curve.getPointAt(0));
	camera.lookAt(curvePath.curve.getPointAt(1.0));
	scene.add(camera);

	const renderer = setupRenderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit to 1.5x max - G4 072125 - Performance Item 3

	// === Unreal Bloom Pass Setup ===
	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);

	const bloomParams = {
		exposure: 0,
		bloomStrength: 0.5,
		bloomThreshold: 0,
		bloomRadius: 0.4  // G4 072425 Performance Item 2
	};

	const bloomPass = new UnrealBloomPass(
		new THREE.Vector2(window.innerWidth, window.innerHeight),
		bloomParams.bloomStrength,
		bloomParams.bloomRadius,
		bloomParams.bloomThreshold
	);
	composer.addPass(bloomPass);
	// ===============================

	let positionAlongPathState = new PositionAlongPathState();

	// G4 062925 Integrated Code to isolate scroll thru scene to when top of canvas reaches top of viewport
	let SplineCanvas = document.querySelector('#spline-path-canvas');
  
  // Support both desktop and mobile scroll
  window.addEventListener('wheel', onUserScroll, { passive: true });
  window.addEventListener('touchmove', onUserScroll, { passive: true });

  let lastScrollTime = 0; // Scroll timestamp for each scroll
  const waitPeriod = .50; // Scroll Thottle speed in milliseconds

  function onUserScroll(event) {
    const SplineCanvasTop = SplineCanvas.getBoundingClientRect().top;
    if (SplineCanvasTop <= 0) {
      // console.log(`Scroll Triggered: SplineCanvas.top = ${SplineCanvasTop}`);
  
      // Simulate scroll delta for touchmove (if needed)
      let delta = 0;
  
      if (event.type === 'wheel') {
        console.log(`wheel`);
        delta = event.deltaY;
      } else if (event.type === 'touchmove') {
        console.log(`touchmove`);
        const cTime = Date.now();

        // Apply Throtting to avoid surge in scroll events on mobile touch
        if (cTime - lastScrollTime >= waitPeriod) {
          lastScrollTime = cTime;

          // Store previous touch Y
          if (typeof onUserScroll.lastTouchY !== 'number') {
            onUserScroll.lastTouchY = event.touches[0].clientY;
            return;
          }
          const currentY = event.touches[0].clientY;
          delta = onUserScroll.lastTouchY - currentY;
          onUserScroll.lastTouchY = currentY;
        } else { return; } // Don't process scroll if waitPeriod not met
      }
  
      // Simulate a synthetic event with a deltaY
      console.log(`handleScroll: delta = ${delta}`);
      handleScroll({ deltaY: delta }, positionAlongPathState);
    }
  }

	// G4 Beginning of Changes for Animation
	const clock = new THREE.Clock();
	// G4 End of Changes for Animation

  // G4 072525 Performance Item - Stop animating when canvas out of viewport
  let splineVisible = true; // G4 Start Visible

	// Animate the scene
	function animate() {
    if (splineVisible) {
      requestAnimationFrame(animate);
      updatePosition(curvePath, camera, positionAlongPathState);

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Use composer instead of renderer
      composer.render();
    } else {
      requestAnimationFrame(animate);
    }
	}
  const splineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
            splineVisible = true;
          } else {
            splineVisible = false;
          } 
      });
  });

  splineObserver.observe(document.getElementById("spline-path-canvas"));
// G4 072525 End Of Performance Item - Stop animating when canvas out of viewport

animate(); // Start the animation

	// GD5 Added handleWindowResize and Event Listener 053125 
	function handleWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight); // resize composer too
		console.log("Window Resize " + window.innerWidth + " x " + window.innerHeight);
	}
	window.addEventListener('resize', handleWindowResize, false);
};



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



// // Pin Section During Scroll Home Page Spline
// // ==============================================


document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("spline-path-canvas");
  const s4 = document.getElementById("section4");
  const scrollThreshold = 2800; // px

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

  window.addEventListener("scroll", () => {
    let s4rect = s4.getBoundingClientRect();
    if (s4rect.bottom <= 0) {
      header.classList.add("sticky");
      header.classList.remove("nosticky"); // Optional
    } else {
      header.classList.remove("sticky");
      header.classList.add("nosticky");
    }
  });
});



// // Case Study Year Update on Scroll
// // ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("activeYear");
  const sections = document.querySelectorAll(".year-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const year = entry.target.dataset.year;
        yearSpan.textContent = year;
      }
    });
  }, {
    threshold: 0.1 // Adjust as needed (0.1 means 10% of the section is visible)
  });

  sections.forEach(section => observer.observe(section));
});


// G4 Added 052825
// G4 Modified 062825
// ---- Update Element Corner Data in Hero Section
// 
let heroElement = document.getElementById("heroSection");
let TLspan = document.getElementById("TLSpan");
let BLspan = document.getElementById("BLSpan");
let TRspan = document.getElementById("TRSpan");
let BRspan = document.getElementById("BRSpan");

function updateHeroDimensions() {
  let rect = heroElement.getBoundingClientRect();
  let heroTop = rect.top.toFixed(2);
  let heroBottom = rect.bottom.toFixed(2);
  let heroRight = rect.right.toFixed(2);
  let heroLeft = rect.left.toFixed(2);

  // console.log("top: "+rect.top+" , bottom: "+rect.bottom+" , left: "+rect.left+" , right "+rect.right);

  TLspan.innerHTML = '(' + heroLeft + ',' + heroTop + ')';
  BLspan.innerHTML = '(' + heroLeft + ',' + heroBottom + ')';
  TRspan.innerHTML = '(' + heroRight + ',' + heroTop + ')';
  BRspan.innerHTML = '(' + heroRight + ',' + heroBottom + ')';
}

document.addEventListener('scroll', updateHeroDimensions);

document.getElementsByTagName("BODY")[0].onload = function() {updateHeroDimensions()};

document.getElementsByTagName("BODY")[0].onresize = function() {updateHeroDimensions()};



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
      end: 'top 90%',
      scrub: false,
      markers: true,
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
  const parentEl = document.querySelector("#cs-card-hover"); // Get the target element

  let hoverTween;

  const createHoverTween = () => {
    if (hoverTween) hoverTween.kill();

    // Use the width of #cs-card-hover instead of window.innerWidth
    const offset = () => {
      if (!parentEl) return 35; // Fallback if the element is not found
      const width = parentEl.offsetWidth;
      return Math.min(Math.max(width * 0.07, 2), 600);
    };

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

  createHoverTween();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createHoverTween();
    }, 150);
  });

  element.addEventListener("mouseenter", () => hoverTween.play());
  element.addEventListener("mouseleave", () => hoverTween.reverse());
});



//Video Player Controls//
const video = document.getElementById("myPreviewVideo");
const playButton = document.getElementById("playButton");
const muteButton = document.getElementById("muteButton");
const muteIcon = document.getElementById("muteIcon");
const videoOverlay = document.getElementById("videoOverlay");
const volumeSlider = document.getElementById("volumeSlider");

// Play video
playButton.addEventListener("click", () => {
  if (video.paused || video.ended) {
    if (video.ended) {
      video.currentTime = 0; // Restart if finished
    }
    video.play();
    videoOverlay.style.opacity = 0;
    playButton.style.display = "none";
  } else {
    video.pause();
    playButton.style.display = "block";
    videoOverlay.style.opacity = 1;
  }
  updateVolumeSliderVisibility();
});

video.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playButton.style.display = "none";
    videoOverlay.style.opacity = 0;
  } else {
    video.pause();
    playButton.style.display = "block";
    videoOverlay.style.opacity = 1;
  }
});


// Replay logic
video.addEventListener("ended", () => {
  playButton.style.display = "block";
  videoOverlay.style.opacity = 1;
});

// Mute/unmute toggle
muteButton.addEventListener("click", () => {
  video.muted = !video.muted;
  muteIcon.src = video.muted ? "Images/VolumeMute2.svg" : "Images/Volume2.svg";
  updateVolumeSliderVisibility();
});

// Volume control
function updateVolumeSliderStyle() {
  const val = volumeSlider.value;
  const percent = val * 100;
  volumeSlider.style.background = `linear-gradient(to right, limegreen 0%, limegreen ${percent}%, #ccc ${percent}%, #ccc 100%)`;
}

volumeSlider.addEventListener("input", () => {
  video.volume = volumeSlider.value;
  video.muted = volumeSlider.value === "0";
  muteIcon.src = video.muted ? "Images/VolumeMute2.svg" : "Images/Volume2.svg";
  updateVolumeSliderVisibility();
  updateVolumeSliderStyle();
});

window.addEventListener("load", () => {
  muteIcon.src = video.muted ? "Images/VolumeMute2.svg" : "Images/Volume2.svg";
  updateVolumeSliderVisibility();
  updateVolumeSliderStyle(); // Set initial color
});


// Update visibility class on slider
function updateVolumeSliderVisibility() {
  if (!video.muted) {
    volumeSlider.classList.add("show");
  } else {
    volumeSlider.classList.remove("show");
  }
}

// Initial setup
window.addEventListener("load", () => {
  muteIcon.src = video.muted ? "Images/VolumeMute2.svg" : "Images/Volume2.svg";
  updateVolumeSliderVisibility();
});


// Video Scroll in GSAP animation

gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: ".video-animate",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play play none reverse",
    markers: false
  }
})
.from(".video-animate", {
  opacity: 0,
  y: -10,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.2
});


// GSAP Home Text Overlay Spline Scroll Section

gsap.registerPlugin(ScrollTrigger);

// Split each line into characters
const lines = document.querySelectorAll(".section5-line");
lines.forEach(line => new SplitType(line, { types: "chars" }));

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section5-text-overlay",
    start: "top top",
    end: "+=30%",
    scrub: true,
    toggleActions: "play play none reverse",
    pin: true,
    markers: true
  }
});

// Animate in the highlight line
tl.from(".section5-highlight-line", {
  opacity: 1,
  duration: 2,
});

// Animate in each line's characters (fade and rise)
lines.forEach((line, index) => {
  const chars = line.querySelectorAll(".char");

  tl.fromTo(chars, {
    opacity: 0,
    y: 600,
  }, {
    opacity: 1,
    y: -10,
    duration: 1,
    stagger: 0.04,
    ease: "power2.out"
  }, "<+=0.3");
});

// Pause before animating out
tl.to({}, { duration: 1.5 });

// Animate out the lines
tl.to(".section5-line-1", {
  y: -500,
  opacity: 0,
  duration: 1,
  ease: "power1.inOut"
});

tl.to(".section5-line-2", {
  opacity: 0,
  duration: 1,
  ease: "power1.inOut"
}, "<");

tl.to(".section5-line-3", {
  y: 500,
  opacity: 0,
  duration: 1,
  ease: "power1.inOut"
}, "<");

// Animate out the highlight line
tl.to(".section5-highlight-line", {
  opacity: 0,
  duration: 1
}, "<");



