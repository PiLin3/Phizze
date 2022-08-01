import { updateCharts, resetCharts, setInititalValues } from "./charts.js";

// Babylon variables
const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
// User inputs
const userInterface = document.getElementById('ui');
const velocityInput = document.getElementById('velocity');
const accelerationInput = document.getElementById('acceleration');
const vBubble = document.getElementById('vel-bubble');
const aBubble = document.getElementById('acc-bubble');
let hideSliderBubble;
// Simulation buttons
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');
let isStarted = false;
let isRunning = false;
// Timer variables
const appendTens = document.getElementById("tenths");
const appendSeconds = document.getElementById("seconds");
let timeIntervel;
let seconds = 0;
let tens = 0;
// Interval variables
let elapsedTime = 0;
let oldPos = 0;
let newPos = 0;
let acceleration;
let simTime;
let finalVelocity;
let initialVelocity;
// Fullscreen variables
const fullscreenbtn = document.querySelector('.fullscreen-btn');
const simScreen = document.querySelector(".simulation-container");
let browser;
// Mobile variables 
const displayCharts = document.getElementsByClassName('chart');
const chartsDisplayBtns = document.querySelector('.charts-btns-container');

// Display sliders' input for the user
userInterface.addEventListener('input', (e) =>{
  if (e.target.hasAttribute('data-input')) {
    if(e.target.getAttribute('data-input') == 'vel'){
      setBubble(e.target, vBubble);
    }else{
      setBubble(e.target, aBubble);
    }
  }
});
function setBubble(range, bubble) {
  clearTimeout(hideSliderBubble);
  const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) );
  const newPosition = 10 - (newValue * 0.2);
  bubble.classList.add('show');
  bubble.innerHTML = `<span>${range.value}</span>`;
  bubble.style.left = `calc(${newValue}% + (${newPosition}px))`;
  hideSliderBubble = setTimeout(()=>{
    bubble.classList.remove('show');
  }, 500)
}
// Babylon JS setup >>>>>>>>>>>>>>>>>>>>
// Create a new scene
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  // Imoport the models
  const city = BABYLON.SceneLoader.ImportMeshAsync("", "./assets/models/", "kinematics-scene.glb", scene).then((result) => {
    const road = scene.getMeshByName("road_primitive0");
    const ruler = scene.getMeshByName("road_primitive1");
    const fWheel = scene.getMeshByName("f_wheel");
    const rWheel = scene.getMeshByName("r_wheel");
    // When start button is pressed
    btnStart.onclick = function() {
      if (!isStarted) {
        initialVelocity = Number(velocityInput.value);
        acceleration = Number(accelerationInput.value);
        isStarted = true;
        isRunning = true;
        // Time to complete simulation
        if (acceleration > 0) {
          simTime = 
          (-initialVelocity + Math.sqrt(Math.abs((initialVelocity * initialVelocity) - 
          (4 * (acceleration / 2) * (-100))))) / (2 * (acceleration / 2));
        }else {
          simTime = 100 / initialVelocity;
        }
        setInititalValues(initialVelocity, acceleration);
        runSimulation();
      }else if (!isRunning) {
        runSimulation();
      }
    }
    // When stop button is pressed
    btnStop.onclick = function() {
      clearInterval(timeIntervel);
      isRunning = false;
    }
    // When reset button is pressed
    btnReset.onclick = function() {
      resetCharts();
      clearInterval(timeIntervel);
      road.position.x = 0;
      ruler.position.x = 0;
      elapsedTime = 0;
      newPos = 0;
      tens = "00";
      seconds = "00";
      appendTens.innerHTML = tens;
      appendSeconds.innerHTML = seconds;
      isStarted = false;
      isRunning = false;
    }
    // Start or resume the simulation
    function runSimulation() {
      timeIntervel = setInterval(() => {
        startTimer();
        elapsedTime += 0.01;
        elapsedTime = Number(elapsedTime.toFixed(2))
        newPos = (initialVelocity * elapsedTime) + 
        (0.5 * acceleration * elapsedTime * elapsedTime);
        if (elapsedTime >= simTime) {
          clearInterval(timeIntervel);
          if (newPos !== 100) {
            finalVelocity = initialVelocity + acceleration * elapsedTime;
            updateCharts(newPos, finalVelocity, acceleration, elapsedTime);
          }
        }
        if (Number.isInteger(elapsedTime / 0.25)){
          finalVelocity = initialVelocity + acceleration * elapsedTime;
          updateCharts(newPos, finalVelocity, acceleration, elapsedTime);
        }
        fWheel.rotate(new BABYLON.Vector3(0, 0, 1), (-newPos - oldPos));
        rWheel.rotate(new BABYLON.Vector3(0, 0, 1), (-newPos - oldPos));
        oldPos = -newPos;
        // Update the position every 0.01 seconds
        road.position.x = -newPos;
        ruler.position.x = -newPos;
      }, 10);
    }
  });  
  // Add a camera to the scene
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3.25, 10, new BABYLON.Vector3(0, -3.95, 0));
  // Add a lights to the scene
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 10, 1));
  light.intensity = 1.15;
  return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
// Timer
function startTimer () {
  tens++;
  if(tens < 10){
    appendTens.innerHTML = "0" + tens;
  }else if (tens < 100){
    appendTens.innerHTML = tens;
  }else {
    seconds++;
    appendSeconds.innerHTML = "0" + seconds;
    tens = 0;
    appendTens.innerHTML = "0" + 0;
  }
  if (seconds > 9){
    appendSeconds.innerHTML = seconds;
  }
}
// Fullscreen switch
fullscreenbtn.addEventListener('click', () => {
  if (window.innerHeight == screen.height) {
    // Exit fullscreen
    if (browser == 'ch') {
      document.exitFullscreen();
    } else if (browser == 'saf') {
      /* Safari */
      document.webkitexitFullscreen();
    } else if (browser == 'ie') {
      /* IE11 */
      document.msexitFullscreen();
    }
  } else {
    // Enter fullscreen
    if (simScreen.requestFullscreen) {
      simScreen.requestFullscreen();
      browser = 'ch';
    } else if (simScreen.webkitRequestFullscreen) {
      /* Safari */
      simScreen.webkitRequestFullscreen();
      browser = 'saf';
    } else if (simScreen.msRequestFullscreen) {
      /* IE11 */
      simScreen.msRequestFullscreen();
      browser = 'ie';
    }
  }
})
// Mobile controls
// Check screen
let mql = window.matchMedia('(max-width: 46.25rem)');
checkScreen();
function checkScreen() {
  if (mql.matches) {
    for(let i = 1; i < 3; i++){
      displayCharts[i].classList.add('hidden');
    }
  }else {
    for(let i = 0; i < 3; i++){
      displayCharts[i].classList.remove('hidden');
    }
  }
}
window.addEventListener('resize', () => {
  checkScreen();
});
// Display chart controls
chartsDisplayBtns.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-chart-index')) {
    let i = e.target.getAttribute('data-chart-index');
    for (let n = 0; n < 3; n++) {
      if (n == i) {
        displayCharts[i].classList.remove('hidden');
        continue;
      }
        displayCharts[n].classList.add('hidden');
    }
  }
});