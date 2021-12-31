varying vec3 v_pos;
varying vec3 v_norm;
varying vec2 v_uv;


uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

void main() {

    float x = position.x;
    float y = position.y;
    float z = position.z + sin(x)*cos(uTime) + cos(y)*sin(uTime);

    gl_Position = projectionMatrix *
        modelViewMatrix * vec4(x, y, z, 1);

    v_pos = position;    
    v_norm = normal;
    v_uv = uv;
    
}