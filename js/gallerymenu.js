// ------- Osmo [https://osmo.supply/] ------- //

document.addEventListener('DOMContentLoaded', function() {
    const wordList = document.querySelector('[data-looping-words-list]');
    const words = Array.from(wordList.children);
    const totalWords = words.length;
    const wordHeight = 100 / totalWords; // Offset as a percentage
    const edgeElement = document.querySelector('[data-looping-words-selector]');
    let currentIndex = 0;
    function updateEdgeWidth() {
      const centerIndex = (currentIndex + 1) % totalWords;
      const centerWord = words[centerIndex];
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      const percentageWidth = (centerWordWidth / listWidth) * 120;
      gsap.to(edgeElement, {
        width: `${percentageWidth}%`,
        duration: 0.5,
        ease: 'Expo.easeOut',
      });
    }
    function moveWords() {
      currentIndex++;
      gsap.to(wordList, {
        yPercent: -wordHeight * currentIndex,
        duration: 1.2,
        ease: 'elastic.out(1, 0.85)',
        onStart: updateEdgeWidth,
        onComplete: function() {
          if (currentIndex >= totalWords - 3) {
            wordList.appendChild(wordList.children[0]);
            currentIndex--;
            gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
            words.push(words.shift());
          }
        }
      });
    }
    updateEdgeWidth();
    gsap.timeline({ repeat: -1, delay: 1 })
      .call(moveWords)
      .to({}, { duration: 2 })
      .repeat(-1);
  });

// ------- Image Appear on Text Hover ------- //

const previewDiv = document.getElementById("image-preview");
const hoverTexts = document.querySelectorAll(".hover-text");

let targetX = 0, targetY = 0;
let currentX = window.innerWidth / 2;
let currentY = window.innerHeight / 2;
let isVisible = false;

// Detect mobile/tablet by pointer type OR screen width
const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;

if (!isMobile) {
  hoverTexts.forEach(text => {
    text.addEventListener("mouseenter", (e) => {
      const imageUrl = e.target.getAttribute("data-img");
      previewDiv.style.backgroundImage = `url(${imageUrl})`;
      previewDiv.style.display = "block";
      isVisible = true;
    });

    text.addEventListener("mousemove", (e) => {
      targetX = e.pageX;
      targetY = e.pageY;
    });

    text.addEventListener("mouseleave", () => {
      previewDiv.style.display = "none";
      isVisible = false;
    });
  });

  function animate() {
    const speed = 0.08;
    const maxPush = 250; // Max pixels the image can be pushed away

    const rect = previewDiv.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - targetX;
    const dy = centerY - targetY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const pushStrength = Math.min(maxPush / (distance + 20), 80); // Avoid divide by zero and limit max push
    const pushX = dx * pushStrength;
    const pushY = dy * pushStrength;

    currentX += ((targetX + pushX) - currentX) * speed;
    currentY += ((targetY + pushY) - currentY) * speed;

    if (isVisible) {
      previewDiv.style.left = currentX + "px";
      previewDiv.style.top = currentY + "px";
    }

    requestAnimationFrame(animate);
  }

  animate();
} else {
  // On mobile/tablet, hide the preview div and disable all listeners/effects
  previewDiv.style.display = "none";
}