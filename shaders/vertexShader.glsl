varying vec3 v_pos;
varying vec3 v_norm;
varying vec2 v_uv;

uniform float uTime;
uniform float uFreq;

uniform vec2 uMouse;
uniform vec2 uResolution;

uniform sampler2D texture1;
uniform sampler2D texture2;

void main() {

    vec2 pos2D = vec2(position.x, position.y);

    float dist = 2.0*exp(-distance(uMouse, pos2D)/2.0);

    float freq = uFreq;

    float x = position.x;
    float y = position.y;
    float z = position.z + (dist)*sin(10.0*x)*cos(uTime) + (dist)*cos(10.0*y)*sin(uTime);

    gl_Position = projectionMatrix *
        modelViewMatrix * vec4(x, y, z, 1);

    v_pos = position;    
    v_norm = normal;
    v_uv = uv;
    
}