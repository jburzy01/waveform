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

    // compute the mouse effect
    vec2 pos2D = vec2(v_pos.x, v_pos.y);
    float dist = exp(-distance(uMouse, pos2D)/2.0);

    // load the initial texture
    vec4 noise = texture2D( texture2, v_uv ); 

    // shift mapping 
    vec2 T1 = v_uv + vec2( 1.5, - 1.5 ) * uTime * 0.02;
    vec2 T2 = v_uv + vec2( - 0.5, 2.0 ) * uTime * 0.01;

    float freq = uFreq;

    T1.x += noise.x * 2.0;
    T1.y += noise.y * 2.0;
    T2.x -= noise.y * 0.2;
    T2.y += noise.z * 0.2;


    vec4 color = texture2D( texture1, T2 * 2.0 );
    
    gl_FragColor = color;
}