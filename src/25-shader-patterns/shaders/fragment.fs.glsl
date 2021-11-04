precision mediump float;
#define PI 3.14159265359
varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
}
vec2 rotate(vec2 uv, float rotation, vec2 mid){
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
        );
}

void main(){

    // <----- Pattern 3 ----->
    // float strength = vUv.x;

    // <----- Pattern 4 ----->
    // float strength = vUv.y;

    // <----- Pattern 5 ----->
    // float strength = 1.0 - vUv.y;

    // <----- Pattern 6 ----->
    // float strength = vUv.y * 10.0;

    // <----- Pattern 7 ----->
    // float strength = mod(vUv.y * 10.0 , 1.0);

    // <----- Pattern 8 ----->
    // float strength = mod(vUv.y * 10.0 , 1.0);

    // strength = strength < 0.5 ? 0.0 : 1.0;

    // if(strength < 0.5){
    //     strength = 0.0;
    // }else{
    //     strength = 1.0;
    // }

    // strength = step(0.5, strength);

    // <----- Pattern 9 ----->
    // float strength = mod(vUv.y * 10.0 , 1.0);
    // strength = step(0.8,strength);

    // <----- Pattern 10 ----->
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // <----- Pattern 11 ----->
    // float strength_2 = mod(vUv.y * 10.0, 1.0);
    // strength_2 = step(0.75, strength_2);
    // float strength_1 = mod(vUv.x * 10.0, 1.0);
    // strength_1 = step(0.75, strength_1);
    // gl_FragColor = vec4( vec3(strength_1 + strength_2), 1.0);

    // float strength = step(0.75, mod(vUv.y * 10.0, 1.0));
    // strength +=step(0.75, mod(vUv.x * 10.0, 1.0));
    // float strength = step(0.75, mod(vUv.y * 10.0, 1.0))+step(0.75, mod(vUv.x * 10.0, 1.0));

    // <----- Pattern 12 ----->
    // float strength = step(0.75, mod(vUv.y * 10.0, 1.0)) * step(0.75, mod(vUv.x * 10.0, 1.0));

    // <----- Pattern 13 ----->
    // float strength = step(0.8, mod(vUv.y * 10.0, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));


    // <----- Pattern 14 ----->
    // float barX = step(0.8, mod(vUv.y * 10.0, 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));

    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));

    // float strength = barX + barY;

    // <----- Pattern 15 ----->
    // float barX = step(0.8, mod(vUv.y * 10.0 + 0.2 , 1.0)) * step(0.4, mod(vUv.x * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // float strength = barY + barX;

    // <----- Pattern 16 ----->
    // float left;
    // if(vUv.x < 0.5){
    //     left = 0.5 - vUv.x;
    // }else{
    //     left = -0.5 + vUv.x;
    // }
    // float strength = left;

    // float strength = abs(vUv.x - 0.5);

    // <----- Pattern 17 ----->
    // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    // <----- Pattern 18 ----->
    // float strength = max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    // <----- Pattern 19 ----->
    // float strength = max(step(0.2,abs(vUv.x - 0.5)),step(0.2,abs(vUv.y - 0.5)));
    // float strength = step(0.2 , max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));

    // <----- Pattern 20 ----->
    // float square1 = 1.0 - step(0.25, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float square2 =  step(0.2, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // <----- Pattern 21 ----->
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // <----- Pattern 22 ----->
    // float strength = (floor(vUv.x * 10.0) / 10.0) * (floor(vUv.y * 10.0) / 10.0);

    // <----- Pattern 23 ----->
    // float strength = random(vUv);

    // <----- Pattern 24 ----->
    // float strength = random(vec2(floor(vUv.x * 10.0) / 10.0,floor(vUv.y * 10.0) / 10.0));

    // <----- Pattern 25 ----->
    // float strength = random(vec2(floor(vUv.x * 10.0) / 10.0,floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0));

    // <----- Pattern 26 ----->
    // float strength = length(vUv);

    // <----- Pattern 27 ----->
    // float strength = length(vUv - 0.5);
    // float strength = distance(vUv, vec2(0.5));

    // <----- Pattern 28 ----->
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // <----- Pattern 29 ----->
    // float strength = 0.015 / distance(vUv,vec2(0.5));


    // <----- Pattern 30 ----->
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // <----- Pattern 31 ----->
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightY * lightX;

    // <----- Pattern 32 ----->
    // vec2 rotatedUv = rotate(vUv, PI * 0.25 , vec2(0.5));
    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightY * lightX;

    // <----- Pattern 33 ----->
    float strength = step(0.25, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(vec3(strength), 1.0);
}
