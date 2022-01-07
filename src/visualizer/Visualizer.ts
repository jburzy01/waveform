import * as THREE from "three";

export class Visualizer {
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
  isPlaying: boolean;
  constructor(shaders: ShaderProfile) {
    this.isPlaying = false;
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
      vertexShader: shaders.vertexShader,
      fragmentShader: shaders.fragmentShader
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
  animate(): void {
    this.isPlaying = true;
    this.renderer.setAnimationLoop(() => {
      this.material.uniforms.uTime.value += 0.01;
      const time = this.material.uniforms.uTime.value;
  
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.meshRay);
  
      if (intersects.length > 0) {
        const point = intersects[0].point;
        this.material.uniforms.uMouse.value.x = point.x;
        this.material.uniforms.uMouse.value.y = point.y;
      } else {
        this.material.uniforms.uMouse.value.x = 10000;
        this.material.uniforms.uMouse.value.y = 10000;
      }
      // animate camera
      this.camera.position.z = 10.0 + 3.0 * Math.sin(time / 10.0);

      this.renderer.render(this.scene, this.camera);
    });
  }
  stop(): void {
    this.isPlaying = false;
    this.renderer.setAnimationLoop(null);
  }
}