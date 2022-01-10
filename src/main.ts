import { Visualizer } from "./visualizer/Visualizer";
import { shaderProfiles } from "./visualizer/Shaders";

class App {
  preferences: HTMLFormElement;
  video: HTMLVideoElement;
  visualizer: Visualizer;

  constructor() {
    this.preferences = <HTMLFormElement>document.getElementById("preferences");
    this.preferences.style.display = "none";

    // Get selected shader profile and construct visualizer
    const prof = <HTMLInputElement>(
      document.querySelector('input[name = "shaderProfile"]:checked')
    );
    this.visualizer = new Visualizer(shaderProfiles[prof.value]);

    // Set event listeners
    document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this));
    document.addEventListener("wheel", this.onDocumentMouseWheel.bind(this));
    document.addEventListener("keydown", this.onKeyPress.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    // Initialize webcam
    this.video = <HTMLVideoElement>document.getElementById("video");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream: MediaStream) => {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err: Error) => console.log("An error occured! " + err));
  }
  // Event handlers
  openFullscreen(element: HTMLElement): void {
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
  }
  closeFullscreen(): void {
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
  }
  onKeyPress(e: KeyboardEvent): void {
    console.log(e.key);
    if (e.key == "f") {
      this.openFullscreen(document.documentElement);
    }
    if (e.key == "Escape" || e.key == "Esc") {
      this.closeFullscreen();
    }
    if (e.key == "s") {
      if (this.visualizer.isPlaying) {
        this.visualizer.stop();
      } else {
        this.visualizer.animate();
      }
      
    }
  }
  onWindowResize(): void {
    this.visualizer.camera.aspect = window.innerWidth / window.innerHeight;
    this.visualizer.camera.updateProjectionMatrix();
    this.visualizer.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  onDocumentMouseMove(event: MouseEvent): void {
    this.visualizer.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.visualizer.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  onDocumentMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    this.visualizer.camera.position.z += event.deltaY / 500;
  }
}

(() => {
  const startButton = <HTMLInputElement>document.getElementById("startButton");
  startButton.addEventListener("click", (event: MouseEvent): void => {
    event.preventDefault();
    const app = new App();
    app.visualizer.animate()
  });
})();
