import { World } from "./World";

const container = document.getElementById("container") as HTMLDivElement;

const world = new World(container);
world.render();
