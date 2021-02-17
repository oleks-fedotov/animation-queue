import "./styles.css";
import queue from "queue";

document.getElementById("app").innerHTML = `
<h1>Animation queue!</h1>

<div class="square"></div>
<div class="circle"></div>
<div class="rectangle"></div>
`;

// core function to wait until the element transition is over
// if in line 18 we don't execute callback, then only first animation from the queue will run
// and the rest will be stuck
const waitAnimation = (element, callback) => {
  const onAnimationEnd = () => {
    element.removeEventListener("webkitTransitionEnd", onAnimationEnd);
    callback();
  };
  element.addEventListener("webkitTransitionEnd", onAnimationEnd);
};

// add animated movement to the element
const moveElement = (element, offset) => {
  if (!element) return;
  element.style.cssText = `
    transform: translateX(${offset}px);
    transition-duration: 2s;
    transition-property: transform;
  `;
};

const circle = document.querySelector(".circle");
const square = document.querySelector(".square");
const rectangle = document.querySelector(".rectangle");

const animationQueue = queue({ autostart: false, concurrency: 1 });

// add to queue movement of the circle
animationQueue.push(() => {
  return new Promise((resolve) => {
    waitAnimation(circle, resolve);
    moveElement(circle, 150);
  });
});

// add to queue movement of the square
animationQueue.push(() => {
  return new Promise((resolve) => {
    waitAnimation(square, resolve);
    moveElement(square, 250);
  });
});

// add to queue movement of the rectangle
animationQueue.push(() => {
  return new Promise((resolve) => {
    waitAnimation(rectangle, resolve);
    moveElement(rectangle, 350);
  });
});

// start the queue to process the movements
setTimeout(() => {
  animationQueue.start();
}, 5000);
