import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const defaultShaders: ShaderProfile = {
  vertexShader,
  fragmentShader
}

const altShaders: ShaderProfile = {
  vertexShader,
  fragmentShader
}

export const shaderProfiles: ShaderProfiles = {
  defaultShaders,
  altShaders
}