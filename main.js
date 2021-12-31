import './style.css';
import * as THREE from 'three';

import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

// Setup
let meshRay;
let mouseMoved = false;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);
camera.position.setY(0);
camera.lookAt(0,0,0);



renderer.render(scene, camera);

const geometry = new THREE.PlaneGeometry( 10, 10, 100, 100 );
const material = new THREE.ShaderMaterial({
  uniforms: { 
    uTime: { type: "f", value: 0 },
    uMouse: { type: "v2", value: new THREE.Vector2()},
    uResolution: { type: "v2", value: new THREE.Vector2()}
  },
  vertexShader,
  fragmentShader
});

const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const mouse = new THREE.Vector2( 0, 0 );
const raycaster = new THREE.Raycaster();

// THREE.Mesh just for mouse raycasting
const geometryRay = new THREE.PlaneGeometry( 10, 10, 100, 100 );
meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
meshRay.matrixAutoUpdate = false;
meshRay.updateMatrix();
scene.add( meshRay );

document.addEventListener( 'mousemove', onDocumentMouseMove );
document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = -( event.clientY / window.innerHeight ) * 2  + 1;
  mouseMoved = true;

}

function onDocumentMouseWheel( event ) {

  camera.position.z += event.deltaY/500;

}


function animate() {
  requestAnimationFrame(animate);

  material.uniforms.uTime.value += 0.005;

  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObject( meshRay );

  if ( intersects.length > 0 ) {
      const point = intersects[ 0 ].point;
      material.uniforms.uMouse.value.x = point.x;
      material.uniforms.uMouse.value.y = point.y;
      console.log(point.x);
      console.log("True");
  }
  else {
    material.uniforms.uMouse.value.x = 10000;
    material.uniforms.uMouse.value.y = 10000;
  }



  renderer.render(scene, camera);
}

animate();
