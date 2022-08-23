import './index.css';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/loaders/glTF';
import {Scalar} from '@babylonjs/core/Maths/math.scalar';


const simScreen = document.querySelector('#simulation-container');
// User interface variables
const ui = simScreen.querySelector('#ui-container');
const rhoInput = ui.querySelector('#resistivity');
const rhoDisplay = ui.querySelector('#resistivity-output');
const areaInput = ui.querySelector('#area');
const areaDisplay = ui.querySelector('#area-output');
const lengthInput = ui.querySelector('#length');
const lengthDisplay = ui.querySelector('#length-output');
const resistance = ui.querySelector('#resistance');
const fullscreenBtn = ui.querySelector('#fullscreen-btn');
const readMoreBtn = simScreen.querySelector('#read-more');

let adjLength = Number(lengthInput.value) / 10;
let currentSpeed = 0.015;
let browser;

// Babylon.js
const canvas = simScreen.querySelector('#renderCanvas'); // Get the canvas element
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
import resistanceScene from '../assets/resistance-scene.glb'; // Import the meshes
import scr from '../../imgs/resistance-scr.webp';

// Create a new scene
const createScene = function () {
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0, 0, 0);

  const models = SceneLoader.ImportMeshAsync('', '', resistanceScene, scene, undefined,
  '.glb').then((result) => {
    const wire = scene.getMeshByName('wire');
    wire.scaling.x = adjLength;
    wire.scaling.y = Math.sqrt((4 * area.value) / Math.PI).toFixed(2);
    wire.scaling.z = Math.sqrt((4 * area.value) / Math.PI).toFixed(2);
    const collider = scene.getMeshByName('collider');
    collider.isVisible = false;
    const electrons = [scene.getMeshByName('electron')];
    for (let i = 1; i < 200; i++) {
      electrons.push(electrons[0].clone('elec' + i));
      electrons[i].position.x = Scalar.RandomRange(-1.4, 1.4);
      electrons[i].position.y = Scalar.RandomRange(-0.25, 0.25);
      electrons[i].position.z = Scalar.RandomRange(-0.25, 0.25);
    }
    function moveElectrons() {
      electrons.forEach(elect => {
        if (elect.intersectsMesh(collider)) {
          elect.isVisible = true;
        }else { 
          elect.isVisible = false;
        }
        if (elect.position.x > 1.4) {
            resetElectPos(elect);
        }
        elect.position.x += currentSpeed;
      });
    }
    function resetElectPos(e) { 
      e.position.x = -1.4;
      e.position.y = Scalar.RandomRange(-0.25, 0.25);
      e.position.z = Scalar.RandomRange(-0.25, 0.25);
    }
    // Chnage length, cross area and electron speed based on user inpout
    ui.addEventListener('input', (e) => {
      // When Resistivity input slider is active
      if (e.target.getAttribute('id') == 'resistivity') {
        rhoDisplay.innerHTML = Number(e.target.value).toFixed(2);
        calcResistance(rhoInput, lengthInput, areaInput);
      }else if (e.target.getAttribute('id') == 'length') {
        // When length input slider is active
        lengthDisplay.innerHTML = Number(e.target.value).toFixed(1);
        calcResistance(rhoInput, lengthInput, areaInput);
        adjLength = (Number(lengthInput.value) / 10).toFixed(2);
        wire.scaling.x = adjLength;
      }else if (e.target.getAttribute('id') == 'area') {
        // When Area input slider is active
        areaDisplay.innerHTML = Number(e.target.value).toFixed(1);
        calcResistance(rhoInput, lengthInput, areaInput);
        wire.scaling.y = Math.sqrt((4 * area.value) / Math.PI).toFixed(2);
        wire.scaling.z = Math.sqrt((4 * area.value) / Math.PI).toFixed(2);
      }
    })
    scene.registerAfterRender(() => {
      moveElectrons();
    })
  });
  // Add a camera to the scene
  const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3.25, 2.5, new Vector3(0, 0, 0));
  // Add a lights to the scene
  const light = new HemisphericLight('light', new Vector3(1, 10, 10));
  light.intensity = 1.25;
  return scene;
};
const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});
// Calculate the electrical resistance based on user input
function calcResistance(p ,l, a) {
  p = Number(p.value);
  l = Number(l.value);
  a = Number(a.value);
  let r = ((p * l) / a).toFixed(2);
  resistance.innerHTML = r;
  if (r < 251 && r > 149) {
    currentSpeed = 0.005;
  }else if (r < 150 && r > 99) {
    currentSpeed = 0.008;
  }else if (r < 100 && r > 49) {
    currentSpeed = 0.013;
  }else if (r < 50 && r > 9) {
    currentSpeed = 0.02;
  }else {
    currentSpeed = 0.03;
  }
}
// Fullscreen switch
fullscreenBtn.addEventListener('click', () => {
  if (window.innerHeight == screen.height) {
    // Exit fullscreen
    if (browser == 'ch') {
      readMoreBtn.disabled = false;
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
      readMoreBtn.disabled = true;
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

// Soical media share buttons
const facebookBtn = document.querySelector('#facebook-btn');
const twitterBtn = document.querySelector('#twitter-btn');
const pinterestBtn = document.querySelector('#pinterest-btn');
const linkedinBtn = document.querySelector('#linkedin-btn');
const whatsappBtn = document.querySelector('#whatsapp-btn');

function setShareLinks() {
  const url = encodeURI(document.location.href);

  facebookBtn.setAttribute('href', 
  `https://www.facebook.com/sharer.php?u=${url}`);
  
  twitterBtn.setAttribute('href', 
  `https://twitter.com/intent/tweet?url=${url}`);
  
  pinterestBtn.setAttribute('href', 
  `https://pinterest.com/pin/create/button/?url=${url}`);

  linkedinBtn.setAttribute('href', 
  `https://www.linkedin.com/sharing/share-offsite/?url=${url}`);

  whatsappBtn.setAttribute('href', 
  `https://wa.me/?text=${decodeURI(document.title)} ${url}`);
}
setShareLinks()