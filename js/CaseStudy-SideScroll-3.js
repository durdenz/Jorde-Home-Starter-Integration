// 061125 G4 Modified ScrollTrigger and snap options

// 061425 G4 Added Creation of OffsetsArray containing offsets calculated from each element 
// with the .contents class. Also modified gsap.to() to use OffsetsArray and to 
// Calculate xPercent using totalWidth as a percentage of window.innerWidth.

import {IsMobile, IsTablet} from '../js/mobileCheck.js'; // G4 071625 Mobile Indicator

if (IsMobile || IsTablet) {
    document.querySelectorAll(".contents").forEach((e) => {
        e.classList.remove("contents");
    });

    document.querySelectorAll(".hold").forEach((e) => {
        e.classList.add("row");
    });
}

gsap.registerPlugin(ScrollTrigger);

let contents = gsap.utils.toArray(".contents");
let OffsetsArray = [0];
let totalWidth = 0;

function makeOffsetsArray(elementsArray) {
    let xPos, xWidth, offset = 0;
    totalWidth = 0;

    for(i=0; i<(contents.length-1); i++) {
        totalWidth+=contents[i].offsetWidth;
    }

    elementsArray.forEach(element => {
        xPos = element.getBoundingClientRect().left;
        xWidth = element.offsetWidth;
        offset = ((xPos + xWidth)/totalWidth);
        OffsetsArray.push(offset);
    });
    OffsetsArray.pop(); // Remove endpoint of last element from the array
    return;
}

makeOffsetsArray(contents);

// Debug Info
for(i=0; i<(OffsetsArray.length); i++) {
    console.log("OffsetsArray["+i+"] = "+OffsetsArray[i]);
};

// console.log("Orig xPercent: "+(1 / (contents.length - 1)));
console.log("new xPercent: "+(-(totalWidth/window.innerWidth)*100));


gsap.to(contents, {
    xPercent: -((totalWidth/window.innerWidth)*100),
    ease: "none",
    scrollTrigger: {
        trigger: "#horizontal",
        pin: true,
        start: "top top",
        scrub: 1,
        snap: {
            // snapTo: (1 / (contents.length - 1)),
            snapTo: OffsetsArray,
            inertia: false,
            duration: { min: 0.1, max: 0.1 },
            delay: 0.0,
            ease: 'power1.inOut',
        },
        end: () => "+=" + (document.querySelector("#horizontal").offsetWidth)
    }
})


// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

// Better block trigger
const block = document.querySelector(".main");

// Button selector
const button = document.querySelector(".cs-button");

// SplitType setup
const splitDate  = new SplitType(".csdate",    { types: "words", tagName: "span" });
const splitTitle = new SplitType(".cs-title",  { types: "words", tagName: "span" });
const splitDesc  = new SplitType(".cs-description", { types: "words", tagName: "span" });
const splitTags  = new SplitType(".tags",      { types: "words", tagName: "span" });

// Animate IN timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: block,
    start: "top bottom",
    end: "top top",
    markers: false,
    toggleActions: "play none none reverse"
  }
});

tl
  .from(splitDate.words, {
    yPercent: 100,
    opacity: 0,
    ease: "power2.out",
    duration: 0.1,
    delay:.2,
    stagger: 0.05
  }, "-=0.1")
  .from(splitTitle.words, {
    yPercent: 100,
    opacity: 0,
    ease: "power3.out",
    delay:.3,
    duration: 0.5,
    stagger: 0.04
  }, "-=0.2")
  .from(splitDesc.words, {
    xPercent: -50,
    opacity: 0,
    ease: "power2.out",
    duration: 0.3,
    stagger: 0.01
  }, "-=0.4")
  .from(splitTags.words, {
    yPercent: 100,
    opacity: 0,
    ease: "power2.out",
    stagger: 0.1
  }, "-=0.42")
  .from(button, {
    yPercent: 100,
    opacity: 0,
    ease: "power2.out"
  }, "-=0.5");

// Animate OUT on scroll down
ScrollTrigger.create({
  trigger: block,
  start: "21% 40%",
  end: "top top",
  markers: true,
  onLeave: () => {
    gsap.to([
      ...splitDate.words,
      ...splitTitle.words,
      ...splitDesc.words,
      ...splitTags.words,
      button
    ], {
      xPercent: -50,
      opacity: 0,
      stagger: 0.01,
      duration: 0.4,
      ease: "power1.in"
    });
  },
  onEnterBack: () => {
    gsap.to([
      ...splitDate.words,
      ...splitTitle.words,
      ...splitDesc.words,
      ...splitTags.words,
      button
    ], {
      xPercent: 0,
      opacity: 1,
      stagger: 0.01,
      duration: 0.4,
      ease: "power1.out"
    });
  }
});

  
