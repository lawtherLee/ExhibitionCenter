import "./utils/init.js";
import * as THREE from "three";
import { scene } from "./utils/init.js";
import guiMove from "./utils/gui.js";

const group = new THREE.Group();
// 数据对象
const sceneInfo = {
  one: {
    publicPath: "technology/1/",
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05], // 宽高
        position: [-0.46, -0.11, -0.11],
        rotation: [1.42, 0.68, 1.63],
        targetAttr: "two",
      },
    ],
  },
  two: {
    publicPath: "technology/2/",
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05], // 宽高
        position: [0.47, -0.2, 0],
        rotation: [1.48, 0.26, -1.78],
        targetAttr: "one",
      },
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05], // 宽高
        position: [-0.46, -0.16, -0.3],
        rotation: [1.21, 0.78, 0],
        targetAttr: "three",
      },
    ],
  },
};
const createCube = () => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.scale.set(1, 1, -1); // 处理镜像
  scene.add(cube);
  return cube;
};

// 纹理贴图
const setMaterialCube = (info) => {
  const { publicPath, imgUrlArr, markList } = info;
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setPath(publicPath);
  cube.material = imgUrlArr.map((item) => {
    const texture = textureLoader.load(item);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  });

  // 地板上的标记
  markList.forEach((item) => {
    if (item.name === "landMark") createLandMark(item);
  });

  scene.add(group);
};

// 地板上的标记
const createLandMark = (mark) => {
  const { imgUrl, wh, position, rotation, targetAttr } = mark;
  const geometry = new THREE.PlaneGeometry(...wh);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(imgUrl),
    side: THREE.DoubleSide,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);

  guiMove(mesh);
};

// 与3d物体绑定点击事件
const bindClick = () => {
  const rayCaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  window.addEventListener("click", () => {});
};

const cube = createCube();
setMaterialCube(sceneInfo.one);
