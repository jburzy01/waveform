varying vec3 v_pos;
varying vec3 v_norm;
varying vec2 v_uv;


uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

void main() {

    vec2 pos2D = vec2(position.x, position.y);

    float dist = exp(-distance(uMouse, pos2D));

    float x = position.x;
    float y = position.y;
    float z = position.z + (0.1+dist)*sin(10.0*x)*cos(uTime) + (0.1+dist)*cos(10.0*y)*sin(uTime);

    gl_Position = projectionMatrix *
        modelViewMatrix * vec4(x, y, z, 1);

    v_pos = position;    
    v_norm = normal;
    v_uv = uv;
    
}