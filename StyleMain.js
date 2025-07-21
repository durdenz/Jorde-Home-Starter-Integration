document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
  
    document.getElementById("cursor-x").textContent = `[     ${x}     ]`;
    document.getElementById("cursor-y").textContent = `[     ${y}     ]`;
  });



// Ensure GSAP and ScrollTrigger are registered
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.normalizeScroll(true); // enables scroll sync fix

// Utility function to compute centered position + scale
function getCenterScalePosition(selector, scaleTo = 0.8) {
  const el = document.querySelector(selector);
  if (!el) return { scale: 1, x: 0, y: 0 };

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const bounds = el.getBoundingClientRect();
  const originalWidth = bounds.width;
  const originalHeight = bounds.height;

  const targetWidth = vw * scaleTo;
  const scale = targetWidth / originalWidth;

  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  const x = (vw - scaledWidth) / 2 - bounds.left;
  const y = (vh - scaledHeight) / 2 - bounds.top;

  return { scale, x, y };
}

// Core animation setup
function applyCenteringAnimation() {
  const { scale, x, y } = getCenterScalePosition(".size-up-load", 0.8);

  gsap.from(".size-up-load", {
    scrollTrigger: {
      trigger: ".size-up-wrapper", // NOTICE: Changed from .h-contain
      start: "6% 5%",
      end: "1% top",
      markers: true,
      scrub: false,
      toggleActions: "play none none reverse",
    },
    scale: scale,
    x: x,
    y: y + 80,
    transformOrigin: "left top",
    duration: 0.6,
    ease: "power.out(1, 0.3)",
    overwrite: true
  });
  
}

// Initial setup after page load
window.addEventListener("load", () => {
  applyCenteringAnimation();
  ScrollTrigger.refresh();
});

// // Reapply on resize (mobile safe)
// window.addEventListener("resize", () => {
//   ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//   applyCenteringAnimation();
//   ScrollTrigger.refresh();
// });

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Use rAF for layout-safe updates
    requestAnimationFrame(() => {
      applyCenteringAnimation();

      // Refresh after animations and DOM changes are in place
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    });
  }, 250);
});



// Other animations (optional)
gsap.timeline()
  .from("#h-arrow", {
    opacity: 0,
    x: -40,
    y: -40,
    duration: 0.3,
    delay: 1.5,
  });

gsap.timeline()
  .from("#h-num", {
    opacity: 0,
    x: -50,
    duration: 0.3,
    delay: 1,
  });


// Page pinning animation
gsap.timeline({
  scrollTrigger: {
    trigger: "main",
    start: "top top",
    end: "+=100%",
    scrub: true,
    pin: true,
    // pinSpacing: false,
    markers: false
  }
});

  




//GSAP and SplitType

const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Change to false to make the animations play when the section's in viewport
const scrub = true;
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger)


const splitTypes = document.querySelectorAll('.reveal-type4')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.chars, {
      stagger: 0.05,
      opacity: 0,
      y:90,
      transformOrigin: 'bottom',
      duration: 0.3,
      delay:0.5,
   })

})




// gsap.from(".size-up-load", {
//     scrollTrigger: {
//         trigger: "main",
//         start: '20% top',
//         end: '20% top',
//         scrub: false,
//         markers: false,
//         ease: "elastic.out(1,0.3)",
//         toggleActions: 'play play reverse reverse',
//     },
//     scale: 2,
//     y:400,
//     transformOrigin: 'left',
//     duration: 0.6,
//   })


// const { scale, x, y } = getCenterScalePosition(".size-up-load", 0.8);

// gsap.from(".size-up-load", {
//   scrollTrigger: {
//     trigger: "main",
//     start: "20% top",
//     end: "20% top",
//     scrub: false,
//     markers: false,
//     ease: "elastic.out(1, 0.3)",
//     toggleActions: "play play reverse reverse",
//   },
//   scale: scale * 1, // animate from double size
//   x: x,
//   y: y + 80, // offset down to animate upward
//   transformOrigin: "left top",
//   duration: 0.6,
// });



//   gsap.timeline({
//     scrollTrigger: {
//       trigger: "main",
//       start: "top top",
//       end: "+=100%",
//       scrub: true,
//       pin: true,
//       markers: false
//     }
//   })


//   gsap.timeline()
// .from("#h-arrow", {
//   opacity: 0,
//   x:-40,
//   y:-40,
//   duration: 0.3,
//   delay:1.5,
// });

// gsap.timeline()
// .from("#h-num", {
//   opacity: 0,
//   x:-50,
//   duration: 0.3,
//   delay:1,
// });

})



gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".line-left").forEach((el) => {
  gsap.from(el, {
    scaleX: 0,
    opacity: 0,
    transformOrigin: "right",
    ease: "ease",
    scrollTrigger: {
      trigger: el,
      start: "+=400 +=200",  // when the top of the element hits 80% of the viewport
      end: "+=400 top", // optional: helps control scrub range
      scrub: true,
      markers: false // remove in production
    }
  });
});

document.querySelectorAll(".line-right").forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      opacity: 0,
      transformOrigin: "left",
      ease: "ease",
      scrollTrigger: {
        trigger: el,
        start: "+=400 +=200",  // when the top of the element hits 80% of the viewport
        end: "+=400 top", // optional: helps control scrub range
        scrub: true,
        markers: false // remove in production
      }
    });
  });
  
  

  document.querySelectorAll(".vertical-line").forEach((el) => {
    gsap.from(el, {
      scaleY: 0,
      transformOrigin: "top center",
      ease: "ease",
      scrollTrigger: {
        trigger: el,
        start: "+=1200 +=800",  // when the top of the element hits 80% of the viewport
        end: "+=900 top", // optional: helps control scrub range
        scrub: true,
        markers: false // remove in production
      }
    });
  });


  function centerElementHorizontally(el) {
    // Ensure the element has position absolute or fixed in CSS
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
  }
  
  // Apply to all .line-left elements
  document.querySelectorAll(".line-left").forEach(centerElementHorizontally);
  
  // Optional: maintain centering on resize
  window.addEventListener('resize', () => {
    document.querySelectorAll(".line-left").forEach(centerElementHorizontally);
  });





// window.onload = function() {
//     gsap.from(".h-arrow", {
//         scale: 2,
//         y:-90,
//         transformOrigin: 'left',
//         duration: 0.6,
//       });
//   };




const splitTypes = document.querySelectorAll('.text-block-animate2')

splitTypes.forEach((char,i) => {

    const text = new SplitType(char,{ types: 'words, chars'})

    gsap.from(text.words, {
       scrollTrigger: {
           trigger: ".h-contain",
           start: "6% 5%",
           end: "1% top",
           scrub: false,
           markers: false,
           toggleActions: 'play play reverse reverse'
       },
       stagger: 0.05,
       opacity: 0,
       x:90,
       transformOrigin: 'bottom',
       duration: 0.3,
    })

  // Timeline for .right-load
  gsap.timeline({
    scrollTrigger: {
      trigger: ".h-contain",
      start: "6% 5%",
      end: "1% top",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse"
    }
  })
  .from(".right-load", {
    opacity: 0,
    x: 400,
    transformOrigin: "left",
    duration: 0.6,
    ease: "power2.out"
  })
  .to(".right-load", { opacity: 0.4, duration: 0.09 })
  .to(".right-load", { opacity: 1, duration: 0.09 })
  .to(".right-load", { opacity: 0.6, duration: 0.08 })
  .to(".right-load", { opacity: 1, duration: 0.1 })
  .to(".right-load", { opacity: 0.4, duration: 0.09 })
  .to(".right-load", { opacity: 1, duration: 0.09 })
  .to(".right-load", { opacity: 0.6, duration: 0.08 })
  .to(".right-load", { opacity: 1, duration: 0.1 });

  // Timeline for .left-load
  gsap.timeline({
    scrollTrigger: {
      trigger: ".h-contain",
      start: "6% 5%",
      end: "1% top",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse"
    }
  })
  .from(".left-load", {
    opacity: 0,
    x: -400,
    transformOrigin: "left",
    duration: 0.6,
    ease: "power2.out"
  })
  .to(".left-load", { opacity: 0.4, duration: 0.09 })
  .to(".left-load", { opacity: 1, duration: 0.09 })
  .to(".left-load", { opacity: 0.6, duration: 0.08 })
  .to(".left-load", { opacity: 1, duration: 0.1 })
  .to(".left-load", { opacity: 0.4, duration: 0.09 })
  .to(".left-load", { opacity: 1, duration: 0.09 })
  .to(".left-load", { opacity: 0.6, duration: 0.08 })
  .to(".left-load", { opacity: 1, duration: 0.1 });
});



  // Split the text into individual characters
  const split = new SplitType(".slot-text", {
    types: "chars"
  });

//   // Optional: hide overflow for rolling effect
//   document.querySelector(".slot-text").style.overflow = "hidden";

//   // Animate each character as if rolling vertically
//   gsap.from(split.chars, {
//     scrollTrigger: {
//         trigger: "main",
//         start: "20% top",
//         end: "20% top",
//         scrub: false,
//         markers: false,
//         toggleActions: "play none none reverse"
//       },
//     yPercent: 150,
//     opacity: 0,
//     stagger: {
//       each: 0.05,
//       from: "start"
//     },
//     ease: "back.out(1.7)",
//     duration: 0.6
//   });