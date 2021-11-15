precision mediump float;
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
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
    // float strength = vUv.y;
    // gl_FragColor = 1.0 - vec4(vec3(strength), 1.0);


    // Pattern - 6
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 7
    // float strength = mod(vUv.y * 10.0, 1.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // 1.way
    // if(strength < 0.5){
    //     strength = 0.0;
    // }else{
    //     strength = 1.0;
    // }

    // 2.way
    // strength = strength < 0.5 ? 0.0 : 1.0;

    // 3.way
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
    // float barX = step(0.8, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 12
    // float barX = step(0.8, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX * barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 13
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX * barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 14
    // float barX = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 15
    // float barX = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 16
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 17
    // float strength = min(abs(vUv.x - 0.5) , abs(vUv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 18
    // float strength = max(abs(vUv.x - 0.5) , abs(vUv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 19
    // float strength = max(step(0.2, abs(vUv.x - 0.5)) , step(0.2, abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 20
    // float square1 = max(step(0.25, abs(vUv.x - 0.5)) , step(0.25, abs(vUv.y - 0.5)));
    // float square2 = 1.0 - max(step(0.3, abs(vUv.x - 0.5)) , 
    // step(0.3, abs(vUv.y - 0.5)));
    // float strength = square1 * square2;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 21
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 22
    // float xStepGradient = floor(vUv.x * 10.0) / 10.0;
    // float yStepGradient = floor(vUv.y * 10.0) / 10.0;
    // float strength = yStepGradient * xStepGradient;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 23
    // float strength = random(vUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 24
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 25
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 27
    // 1.way
    // float strength = length(vUv);
    // 2.way
    // float strength = distance(vUv, vec2(0,0));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 28
    // float strength = distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 29
    // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 29
    // float strength = 0.015 / distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 30
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.015 / distance(lightUv, vec2(0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 31
    // vec2 lightUv1 = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUv1, vec2(0.5));
    // vec2 lightUv2 = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUv2, vec2(0.5));
    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25 , vec2(0.5));
    // vec2 lightUv1 = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUv1, vec2(0.5));
    // vec2 lightUv2 = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUv2, vec2(0.5));
    // float strength = lightX * lightY;
    // gl_FragColor = vec4(vec3(strength), 1.0);



    // Pattern - 33
    // float strength = step(0.25, distance(vUv, vec2(0.5)));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 35
    // float strength = step(0.015, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 36
    // float strength = 1.0 - step(0.015, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);



    // Pattern - 37
    // vec2 wavedUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.015, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);



    // Pattern - 38
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.015, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);



    // Pattern - 39
    // vec2 wavedUv = vec2(
    //     vUv.x + sin(vUv.y * 100.0) * 0.1,
    //     vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.015, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);


    // Pattern - 40
    float angle = atan(vUv.x, vUv.y);
    float strength = angle;
    gl_FragColor = vec4(vec3(strength), 1.0);




}