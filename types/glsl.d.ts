// import { ShaderMaterialParameters } from "three/src/materials/ShaderMaterial" 

declare module '*.glsl' {
  // const value: ShaderMaterialParameters["vertexShader"]
  const value: string;
  export default value;
}