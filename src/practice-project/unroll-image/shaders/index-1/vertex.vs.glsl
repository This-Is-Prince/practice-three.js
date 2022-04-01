
varying vec2 vUv;
uniform float progress;

void main(){
    float radius = 2.0;
    radius *= 1.0 - position.x;
    vec3 RolledPosition = vec3(2.0 * cos(position.x),position.y , 2.0 * sin(position.x));
    vec3 finalPosition = mix(RolledPosition, position, progress);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vec4 pos = vec4(projectedPosition);

    gl_Position = pos;
    vUv = uv;
}