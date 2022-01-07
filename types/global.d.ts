interface Document {
  // exitFullscreen: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  mozExitFullscreen?: () => Promise<void>;
}

interface HTMLElement {
  msRequestFullscreen?: () => Promise<void>;
  mozRequestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void> 
}

interface ShaderProfile {
  vertexShader: string;
  fragmentShader: string;
}

interface ShaderProfiles {
  [key: string]: ShaderProfile;
}