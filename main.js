import "./style.css";
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

// Setup
(function initWebcam() {
  const video = document.getElementById("video");
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => console.log("An error occured! " + err));
})();

class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.setZ(10);
    this.camera.position.setY(0);
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);

    this.textureLoader = new THREE.TextureLoader();

    this.texture = new THREE.VideoTexture(document.getElementById("video"));

    this.geometry = new THREE.PlaneGeometry(50, 25, 1000, 1000);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { type: "f", value: 0 },
        uMouse: { type: "v2", value: new THREE.Vector2() },
        uResolution: { type: "v2", value: new THREE.Vector2() },
        texture1: { type: "t", value: this.texture },
        texture2: { type: "t", value: this.textureLoader.load("noise.png") },
      },
      vertexShader,
      fragmentShader,
    });

    this.material.uniforms.texture1.value.wrapS =
      this.material.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
    this.material.uniforms.texture2.value.wrapS =
      this.material.uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(5, 5, 5);

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.pointLight, this.ambientLight);

    this.mouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();

    // THREE.Mesh just for mouse raycasting
    this.geometryRay = new THREE.PlaneGeometry(100, 25, 100, 100);
    this.meshRay = new THREE.Mesh(
      this.geometryRay,
      new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
    );
    this.meshRay.matrixAutoUpdate = false;
    this.meshRay.updateMatrix();
    this.scene.add(this.meshRay);
  }
}

const app = new App();

// Event handlers
const onDocumentMouseMove = (event) => {
  app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

const onWindowResize = () => {
  app.camera.aspect = window.innerWidth / window.innerHeight;
  app.camera.updateProjectionMatrix();

  app.renderer.setSize(window.innerWidth, window.innerHeight);
};

const onDocumentMouseWheel = (event) => {
  app.camera.position.z += event.deltaY / 500;
};

/* View in fullscreen */
const openFullscreen = (element) => {
  // Supports most browsers and their versions.
  var requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
};

/* Close fullscreen */
const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
};

const onKeyPress = (e) => {
  console.log(e.key);
  if (e.key == "f") {
    openFullscreen(document.documentElement);
  }
  if (e.key == "Escape" || e.key == "Esc") {
    closeFullscreen();
  }
};

document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("mousewheel", onDocumentMouseWheel, false);
document.addEventListener("keydown", onKeyPress);

window.addEventListener("resize", onWindowResize, false);

(function animate() {
  requestAnimationFrame(animate);

  app.material.uniforms.uTime.value += 0.01;

  app.raycaster.setFromCamera(app.mouse, app.camera);
  const intersects = app.raycaster.intersectObject(app.meshRay);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    app.material.uniforms.uMouse.value.x = point.x;
    app.material.uniforms.uMouse.value.y = point.y;
  } else {
    app.material.uniforms.uMouse.value.x = 10000;
    app.material.uniforms.uMouse.value.y = 10000;
  }

  app.renderer.render(app.scene, app.camera);
})();
