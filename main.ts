import "./style.css";
import * as THREE from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

(function initWebcam(): void {
  const video = <HTMLVideoElement>document.getElementById("video");
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream: MediaStream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err: Error) => console.log("An error occured! " + err));
})();

class App {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  textureLoader: THREE.TextureLoader;
  texture: THREE.VideoTexture;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  plane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  pointLight: THREE.PointLight;
  ambientLight: THREE.AmbientLight;
  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  geometryRay: THREE.PlaneGeometry;
  meshRay: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const canvas = <HTMLCanvasElement>document.querySelector("#bg");
    this.renderer = new THREE.WebGLRenderer({
      canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.setZ(10);
    this.camera.position.setY(0);
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);

    this.textureLoader = new THREE.TextureLoader();

    const video = <HTMLVideoElement>document.getElementById("video");
    this.texture = new THREE.VideoTexture(video);

    this.geometry = new THREE.PlaneGeometry(50, 25, 1000, 1000);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uResolution: { value: new THREE.Vector2() },
        texture1: { value: this.texture },
        texture2: { value: this.textureLoader.load("./img/noise.png") },
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

const openFullscreen = (element: HTMLElement): void => {
  // Supports most browsers and their versions.
  const requestMethod =
    element.requestFullscreen ||
    element.webkitRequestFullscreen ||
    element.mozRequestFullscreen ||
    element.msRequestFullscreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
};

const closeFullscreen = (): void => {
  const doc = <Document>document;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    // Safari
    doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    // IE11
    doc.msExitFullscreen();
  }
};

const onKeyPress = (e: KeyboardEvent): void => {
  console.log(e.key);
  if (e.key == "f") {
    openFullscreen(document.documentElement);
  }
  if (e.key == "Escape" || e.key == "Esc") {
    closeFullscreen();
  }
};

const startButton = <HTMLButtonElement>document.getElementById( 'startButton' );

const init = (): void => {

  startButton.style.display = 'none';
  const app = new App();

  // Event Handlers
  const onDocumentMouseMove = (event: MouseEvent): void => {
    app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  const onWindowResize = (): void => {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const onDocumentMouseWheel = (event: WheelEvent): void => {
    event.preventDefault();
    app.camera.position.z += event.deltaY / 500;
  };

  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("wheel", onDocumentMouseWheel);
  document.addEventListener("keydown", onKeyPress);
  window.addEventListener("resize", onWindowResize, false);

  (function animate(): void {
    requestAnimationFrame(animate);

    app.material.uniforms.uTime.value += 0.01;
    const time = app.material.uniforms.uTime.value;

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

    // animate camera
    app.camera.position.z = 10.0 + 3.0*Math.sin(time/10.0)

    app.renderer.render(app.scene, app.camera);
  })();
    
}

startButton.addEventListener( 'click', init );
