uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;


attribute float aRandom;
attribute vec3 position;

void main(){
    vec4 modelPosition = modelMatrix * vec4(aRandom + position.x  , aRandom + position.y, aRandom + position.z, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vec4 pos = vec4(projectedPosition);

    gl_Position = pos;
}