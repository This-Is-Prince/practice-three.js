precision mediump float;

varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main(){
    // Pattern - 1
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // Pattern - 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // Pattern - 3
    // float strength = vUv.x;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 4
    // float strength = vUv.y;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 5
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 6
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 7
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 8
    // float strength = mod(vUv.y * 10.0, 1.0);

    // strength = strength < 0.5 ? 0.0 : 1.0;

    // if(strength < 0.5){
    //     strength = 0.0;
    // }else{
    //     strength = 1.0;
    // }

    // strength = step(0.5, strength);

    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8,  mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.8,  mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4,  mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 16
    // float strength = vUv.x < 0.5 ? 0.5 - vUv.x : vUv.x -0.5;
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 17
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 18
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 19
    // float strength = step(0.2,max( abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 20
    // float square1 = step(0.2 , max(abs(vUv.x - 0.5), abs(vUv.y - 0.5) ));
    // float square2 = 1.0 - step(0.25 , max(abs(vUv.x - 0.5), abs(vUv.y - 0.5) ));
    // float strength = square1 * square2;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 21
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 22
    // float x = floor(vUv.x * 10.0) / 10.0;
    // float y = floor(vUv.y * 10.0) / 10.0;
    // float strength = x * y;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 24
    // float x = floor(vUv.x * 10.0) / 10.0;
    // float y = floor(vUv.y * 10.0) / 10.0;
    // float strength = random(vec2(x, y));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 25
    // float x = floor(vUv.x * 10.0) / 10.0;
    // float y = floor((vUv.y + vUv.x) * 10.0) / 10.0;
    // float strength = random(vec2(x, y));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 26
    // float strength = length(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 27
    // float strength = length(abs(vUv - 0.5));
    // float strength = length(vUv - 0.5);
    // float strength = distance(vUv,vec2( 0.2, 0.8));
    // float strength = distance(vUv,vec2( 0.5, 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 28
    // float strength = 1.0 - distance(vUv,vec2( 0.5, 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 29
    // float strength = 0.03 / distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 29
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.015 / distance(lightUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    // Pattern - 30
    vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightY * lightX;
    gl_FragColor = vec4(vec3(strength), 1.0);


}