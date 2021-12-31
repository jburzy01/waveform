varying vec3 v_pos;
varying vec3 v_norm;
varying vec2 v_uv;

uniform float uTime;

uniform vec2 uMouse;
uniform vec2 uResolution;




void main() {

    vec3 light = vec3(0, -5.0, 10.0);
    light = normalize(light);

    float v = dot(light,v_norm);

    float r = 1.0;
    float g = 1.0;
    float b = 1.0;

    vec2 pos2D = vec2(v_pos.x, v_pos.y);

    float dist = log(distance(uMouse, pos2D));

    vec3 color = vec3(v_uv.x + dist, v_uv.y + dist, 1.0);
    vec3 ncolor = normalize(color);

    gl_FragColor = vec4( ncolor, 1.0);
}