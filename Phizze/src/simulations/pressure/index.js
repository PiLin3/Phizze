import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/loaders/glTF';
import pressureScene from '../assets/pressure-scene.glb'; // Import the mesh
import './index.css';
import scr from '../../imgs/pressure-scr.webp';

const simScreen = document.querySelector('#simulation-container');
const ui = simScreen.querySelector('#ui');
const forceUi = ui.querySelector('#forceUi');
const areaUi = ui.querySelector('#areaUi');
const pressureUi = ui.querySelector('#pressure');
const fullscreenBtn = ui.querySelector('#fullscreen-btn');
const readMoreBtn = ui.querySelector('[data-panel-btn="3"]');
let pressure = 10;
let browser;

areaUi.innerHTML = (5).toFixed(2);
calcPressure(forceUi.innerHTML, areaUi.innerHTML);
// Babylon
const canvas = simScreen.querySelector('#renderCanvas'); // Get the canvas element
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
// Create a new scene
const  createScene = function () {
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0, 0, 0);

  // Imoport the models
  const models = SceneLoader.ImportMeshAsync('', '', pressureScene, scene, undefined,
  '.glb').then(() => {
    const plane = scene.getMeshByName('plane');
    const collider = scene.getMeshByName('collider');
    let vectors = [scene.getMeshByName('vector')];
    const vectorNode = scene.getTransformNodeByName('vector-node');
    collider.isVisible = false;

    distributeForceVector();
    area(5);
    // Create the clones from the original mesh
    for (let x = 0; x < 84; x++) {
      vectors.push(vectors[0].clone('arrow' + x));    
    }
    let index = 0;
    let posX = 0.5;
    let posZ = 0;
    // create the vectors array
    for (let z = 0; z < 9; z++) {
      if ((z + 1) % 2 == 0) { // 10 vectors row
        for (let x = 0; x < 10; x++) {
          vectors[index].position.z = posZ;
          vectors[index].position.x = posX;
          posX -= 1;
          index += 1;
        }
      }else {
        for (let x = 0; x < 9; x++) { // 9 vectors row
          posX -= 0.5;
          vectors[index].position.z = posZ;
          vectors[index].position.x = posX;
          posX -= 0.5;  
          index += 1;        
        }
      }
      posX = 0.5;
      posZ -= 1;
    }

    // Display sliders' input for the user
    ui.addEventListener('input', (e) => {
      if (e.target.hasAttribute('data-input')) {
        if (e.target.getAttribute('data-input') == 'force') {
          forceUi.innerHTML = e.target.value;
        } else {
          areaUi.innerHTML = Number(e.target.value).toFixed(2);
          area(areaUi.innerHTML);
        }
        calcPressure(forceUi.innerHTML, areaUi.innerHTML);
        distributeForceVector();
      }
    });
    // Scale the force vectors
    function distributeForceVector() {
      let adjustedValue = pressure / 25;
      vectorNode.scaling.y = adjustedValue;
      adjustedValue = pressure / 102;      
      plane.material.albedoTexture.uOffset = adjustedValue;
    }
    // Scale plane area up and down
    function area(a) {
      plane.scaling.x = Number(a / 10).toFixed(2);
      plane.scaling.z = Number(a / 10).toFixed(2);
    }
    // Hide vectors if they are outside of area boundaries
    scene.registerBeforeRender(function () {
      vectors.forEach((vector) => {
        if (vector.intersectsMesh(collider, false)) {
          vector.isVisible = true;
        }else {
          vector.isVisible = false;
        }
      })
    })
  })
  // Add a camera to the scene
  const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 3.25, 10, new Vector3(4.5, 4, 1));
  // Add a lights to the scene
  const light = new HemisphericLight('light', new Vector3(1, 10, 1));
  light.intensity = 1.15;
  return scene;
};
const scene = createScene(); // Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});

// Calculate Pressure based on user input
function calcPressure(f, a) {
  pressure = (Number(f) / Number(a)).toFixed(2);
  pressureUi.innerHTML = pressure;
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
