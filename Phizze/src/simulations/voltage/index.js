import './index.css';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Curve3 } from '@babylonjs/core/Maths/math.path';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { CreateLines } from '@babylonjs/core/Meshes/Builders/linesBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock';
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle';
import '@babylonjs/loaders/glTF';

const simScreen = document.querySelector('#simulation-container');
const voltageSlider = simScreen.querySelector('#voltage');
const voltageDisplay = simScreen.querySelector('#voltage-output');
const fullscreenBtn = simScreen.querySelector('#fullscreen-btn');
const readMoreBtn = simScreen.querySelector('#read-more');
let currentIntensity = new Color3(0, 0.15, 0.05);
let voltage = 1.5;
let browser;

// Babylon.js
const canvas = simScreen.querySelector('#renderCanvas'); // Get the canvas element
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine
import voltageScene from '../assets/voltage-scene.glb'; // Import the meshes
import texture from '../assets/electron.webp'; // Import the meshes
import scr from '../../imgs/voltage-scr.webp';
// Create a new scene
const createScene = function () {
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0.15, 0.15, 0.25);
  const models = SceneLoader.ImportMeshAsync('', '', voltageScene, scene, undefined,
  '.glb').then(() => { 
    const battery = scene.getMeshByName('battery');
    const bulbCoil = scene.getMeshByName('light');
    bulbCoil.material.emissiveColor = new Color3(1,0.9,0);
    const gl = new GlowLayer('glow', scene, {blurKernelSize: 256});
    gl.intensity = (voltage / 8) * 50;
    // Create GUI 
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
    // Create a parent rectangular
    var voltsParent = new Rectangle();
    voltsParent.adaptWidthToChildren = true;
    voltsParent.height = "40px";
    voltsParent.cornerRadius = 10;
    voltsParent.thickness = 2;
    voltsParent.color = "white";
    voltsParent.background = "#ffffff1a";
    advancedTexture.addControl(voltsParent);    
    // Create a UI text block
    var volts = new TextBlock();
    volts.text = 'Volts = ' + voltage + ' Joules / Coulomb';
    volts.color = 'white';
    volts.width = "200px";
    volts.fontSize = 14;
    // volts.top = '100px'
    voltsParent.addControl(volts);
    voltsParent.linkWithMesh(battery);
    voltsParent.linkOffsetY = -50;
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> The Particle System >>>>>>>>>>>>
    // Particle Colors
    const color1 = new Color3(0, 1, 0);
    const color2 = new Color3(0.07, 0, 0.1);
    const colorDead = new Color3(0.15, 0, 0.15);
    // An array of Vector3 the curve must pass through (Curve's Path)
    const wirePath = [
      new Vector3(3, -1.3, 0),
      new Vector3(0, -1.7, 0),
      new Vector3(-3, -1.3, 0),
      new Vector3(-3, 1.3, 0),
      new Vector3(0, 1.7, 0),
      new Vector3(3, 1.3, 0),
    ];
    // Create the curve
    const catmullRom = Curve3.CreateCatmullRomSpline(wirePath, 20, true);
    const numParticles = 1000;
    // Call the (Create the particle system) function
    createPs(catmullRom, new ParticleSystem("ps", numParticles, scene), color1, color2, colorDead);
    // A visualization for the curve path -- Replace with model after testing
    let wire = CreateLines("catmullRomh", {points: catmullRom.getPoints(), useVertexAlpha: false}, scene);
    wire.color = new Color3(0, 0, 0)
    // Create the particle system
    function createPs(emitter, ps, color1, color2, colorDead) {      
      ps.particleTexture = new Texture(texture, scene);
      ps.minSize = 0.25;
      ps.maxSize = 0.25;
      ps.minLifeTime = Infinity;
      ps.maxLifeTime = Infinity;
      ps.minEmitPower = 0.2;
      ps.maxEmitPower = 0.5;
    
      ps.minAngularSpeed = 0;
      ps.maxAngularSpeed = Math.PI;
      
      ps.emitter = emitter.getPoints()[0];
  
      ps.emitRate = 50;
      ps.updateSpeed = 0.02;
      ps.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    
      ps.color1 = color1;
      ps.color2 = color2;
      ps.colorDead = colorDead;
    
      ps.direction1 = new Vector3(0, 1, 0);
      ps.direction2 = new Vector3(0, 1, 0);
      ps.minEmitBox = new Vector3(-0.025, -0.025, -0.025);
      ps.maxEmitBox = new Vector3(0.025, 0.025, 0.025);
      
      ps.updateFunction = update.bind(ps, Math, emitter)
      ps.preWarmCycles = 600;
      ps.start();
    }
    function update(math, emitter, particles) {
      if (this._scaledUpdateSpeed > 1/10) {
          this._scaledUpdateSpeed = 1/10;
      }
      for (let index=0; index < particles.length; ++index) {
        let particle = particles[index];
        // Change the color based on voltage
        particle.color = currentIntensity;

        particle.age += this._scaledUpdateSpeed;
        if (particle.color.a < 0) particle.color.a = 0;
        particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
            
        let length = emitter.getPoints().length;
        let posIndex = math.floor(particle.age*10)%length;
        if (posIndex!==length-1){
          particle.direction = (emitter.getPoints()[posIndex+1].subtract(emitter.getPoints()[posIndex])).scale(10);
        }else {
          particle.direction = (emitter.getPoints()[0].subtract(emitter.getPoints()[posIndex])).scale(10);
        }
        particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
        particle.position.addInPlace(this._scaledDirection);
      }
    }
    // Get the slider input value
    voltageSlider.addEventListener('input', (e) => {
      voltage = Number(e.target.value).toFixed(1);
      voltageDisplay.innerHTML = voltage;
      volts.text = 'Volts = ' + voltage + ' Joules / Coulomb';
      currentIntensity = new Color3(0, voltage / 10, 0.05);
      // Change the bulb coil brightness based on voltage
      gl.intensity = (voltage / 8) * 50;
    })
  });
  // Add a camera to the scene
  const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 10.5, new Vector3(0, 0.4, 0));
  // Add a lights to the scene
  const light = new HemisphericLight('light', new Vector3(1, 10, 10));
  light.intensity = 0.7;
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