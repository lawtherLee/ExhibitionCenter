import "./utils/init.js";
import * as THREE from "three";
import { scene } from "./utils/init.js";

const createCube = () => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return cube;
};

const cube = createCube();
