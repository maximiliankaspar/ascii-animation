import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

import model2 from 'url:../models/model2.stl';
import model3 from 'url:../models/model3.stl';
import model4 from 'url:../models/model4.stl';
import model5 from 'url:../models/model5.stl';
import model6 from 'url:../models/model6.stl';
import model7 from 'url:../models/model7.stl';
import model8 from 'url:../models/model8.stl';

const modelList = [model2, model3, model4, model5, model6, model7, model8];
const randomIndex = Math.floor(Math.random() * modelList.length);
const modelURL = modelList[randomIndex];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);
camera.up.set(0, 0, 1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const effect = new AsciiEffect(renderer, ' .:-=+*1#%@0$!*', { invert: false, resolution: 0.2 });
effect.domElement.style.color = '#ADADAD';
effect.domElement.style.backgroundColor = 'white';
effect.setSize(window.innerWidth, window.innerHeight);
document.getElementById('ascii-container').appendChild(effect.domElement);

const loader = new STLLoader();
let mesh;

loader.load(modelURL, (geometry) => {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  const offsetX = (boundingBox.max.x + boundingBox.min.x) / 2;
  const offsetY = (boundingBox.max.y + boundingBox.min.y) / 2;
  const height = boundingBox.max.z - boundingBox.min.z;
  const offsetZ = boundingBox.min.z + height / 1.7;

  geometry.translate(-offsetX, -offsetY, -offsetZ);

  const material = new THREE.MeshNormalMaterial();
  mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.set(Math.PI, 0, 0); // flipped upright, starts aligned to Z

  scene.add(mesh);
  animate();
});

function animate() {
  requestAnimationFrame(animate);
  if (mesh) {
    mesh.rotation.z += 0.002; // only Z-axis rotation
  }
  effect.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
});
