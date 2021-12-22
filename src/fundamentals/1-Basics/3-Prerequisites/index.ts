/**
 * This import is valid if we specify type = "module" attribute in script tag
 */
import * as THREE from "three";

/**
 * Know How closures work
 */
function a(v: number) {
  const foo = v;
  return function () {
    return foo;
  };
}

const f = a(123);
const g = a(456);
console.log(f()); // prints 123
console.log(g()); // prints 456

const arr = [1, 2, 3, 4];

for (const elm of arr) {
  console.log(elm);
}
const obj = {
  name: "Prince",
  age: 21,
  class: 10,
};
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

const dims = { width: 100, height: 50 };
// const width=dims.width;
// const height=dims.height;

const { width, height } = dims;

const position = [5, 6, 7, 1];
// const y=position[1];
// const z=position[2];

const [, y, z] = position;
console.log(y, z);
const { 1: another_y, 2: another_z } = position;
console.log(another_y, another_z);

// Destructuring also works in function arguments
const vector = [3, 4];

function lengthOfVector([x, y]) {
  return Math.sqrt(x * x + y * y);
}
