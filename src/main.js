import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TerrainGenerator } from './terrain/TerrainGenerator.js';
import { RunRenderer } from './runs/RunRenderer.js';
import { LiftRenderer } from './lifts/LiftRenderer.js';
import { TreeGenerator } from './environment/TreeGenerator.js';
import { SkyManager } from './environment/Sky.js';
import { setupControls } from './ui/Controls.js';

// Scene setup - warmer sky color like in reference
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ec8e8);
scene.fog = new THREE.FogExp2(0xa8d8ea, 0.0004);

// Camera - positioned for classic trail map view (SE looking NW)
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    6000
);
// Position matching the reference trail map perspective
camera.position.set(200, 600, 1200);

// Renderer with better quality settings
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Controls - target the center of the mountain
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 200;
controls.maxDistance = 3000;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 150, 0);

// Lighting - warm sunlight matching trail map artwork
const ambientLight = new THREE.AmbientLight(0xf0f5ff, 0.5);
scene.add(ambientLight);

// Main sun - positioned for classic trail map lighting (sun from upper left)
const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.4);
sunLight.position.set(-400, 800, 400);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 2500;
sunLight.shadow.camera.left = -1200;
sunLight.shadow.camera.right = 1200;
sunLight.shadow.camera.top = 1200;
sunLight.shadow.camera.bottom = -1200;
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

// Fill light from the right
const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.3);
fillLight.position.set(300, 200, -200);
scene.add(fillLight);

// Hemisphere light for natural sky/ground coloring
const hemiLight = new THREE.HemisphereLight(0x8ec8e8, 0x3d5a3d, 0.6);
scene.add(hemiLight);

// App state
const appState = {
    showRuns: true,
    showLifts: true,
    showTrees: true,
    showLabels: true,
    showGreen: true,
    showBlue: true,
    showBlack: true,
    showDouble: true,
    isNight: false,
    terrain: null,
    runs: null,
    lifts: null,
    trees: null,
    sky: null
};

// Initialize scene
async function init() {
    console.log('Initializing Keystone 3D Map...');

    // Generate terrain first (other systems depend on it)
    const terrainGenerator = new TerrainGenerator();
    appState.terrain = terrainGenerator.generate();
    scene.add(appState.terrain);

    // Generate trees (should be rendered before runs for proper layering)
    const treeGenerator = new TreeGenerator(terrainGenerator);
    appState.trees = treeGenerator.generate();
    scene.add(appState.trees);

    // Generate ski runs
    const runRenderer = new RunRenderer(terrainGenerator);
    appState.runs = runRenderer.generate();
    scene.add(appState.runs);

    // Generate lifts
    const liftRenderer = new LiftRenderer(terrainGenerator);
    appState.lifts = liftRenderer.generate();
    scene.add(appState.lifts);

    // Generate sky
    const skyManager = new SkyManager();
    appState.sky = skyManager.generate();
    scene.add(appState.sky);

    // Setup UI controls
    setupControls(appState, camera, controls, scene, sunLight, hemiLight, renderer);

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 800);

    console.log('Keystone 3D Map initialized!');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    // Update lift animations
    if (appState.lifts && appState.lifts.userData.update) {
        appState.lifts.userData.update();
    }

    renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start
init();
animate();
