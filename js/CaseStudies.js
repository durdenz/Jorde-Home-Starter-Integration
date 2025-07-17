function isInViewport(element) {
    let rect = element.getBoundingClientRect();
    let triggerPoint = window.innerHeight * 0.55;
    return (
        rect.top <= triggerPoint && rect.bottom >= 0
    );
}

function updateCSYear() {
    let cs2024 = document.getElementById("cs2024");
    let cs2023 = document.getElementById("cs2023");
    let csyear = document.getElementById("cs-year");

    if(isInViewport(cs2023)) {
        csyear.innerHTML = "+2023+";
        console.log("cs2023 in Viewport");
    } else if (isInViewport(cs2024)) {
        csyear.innerHTML = "+2024+";
        console.log("cs2024 in Viewport");
    } else {
        csyear.innerHTML = "";
        console.log("Nothing in Viewport");
    }
}

// Add EventListeners
document.addEventListener('scroll', updateCSYear);
document.addEventListener('onload', updateCSYear);
document.addEventListener('onresize', updateCSYear);