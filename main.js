import "./utils/init.js";
import * as THREE from "three";
import { camera, scene } from "./utils/init.js";
import guiMove from "./utils/gui.js";
import { CSS3DObject } from "three/addons";
import info from "three/addons/renderers/common/Info.js";

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
  three: {
    publicPath: "technology/3/",
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05],
        position: [0.4, -0.18, 0.32],
        rotation: [-1.53, -0.04, -1.26],
        targetAttr: "two", // 目标场景信息对象属性
      },
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05],
        position: [0.32, -0.16, -0.33],
        rotation: [1.46, 0.1, -0.17],
        targetAttr: "four", // 目标场景信息对象属性
      },
    ],
  },
  four: {
    publicPath: "technology/4/",
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.05, 0.05],
        position: [-0.35, -0.22, 0.4],
        rotation: [-0.85, -0.45, -1.8],
        targetAttr: "three", // 目标场景信息对象属性
      },
      {
        name: "dom",
        position: [0.49, 0, 0],
        rotation: [0, -0.5 * Math.PI, 0],
        targetAttr: "five", // 目标场景信息对象属性
        active(e) {
          setMaterialCube(sceneInfo.five);
        },
      },
    ],
  },
  five: {
    publicPath: "technology/5/",
    imgUrlArr: ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    markList: [
      {
        name: "landMark",
        imgUrl: "other/landmark.png",
        wh: [0.03, 0.03],
        position: [-0.05, -0.05, 0.4],
        rotation: [1.21, -0.15, -0.69],
        targetAttr: "four", // 目标场景信息对象属性
      },
      {
        name: "video",
        imgUrl: "video/movie.mp4",
        wh: [0.2, 0.1],
        position: [0.49, 0.04, 0.045],
        rotation: [0, -0.5 * Math.PI, 0],
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

// 清除上一个场景的地板标记
const clearPrevMark = () => {
  const list = [...group.children];
  list.forEach((item) => {
    // 解决原生dom没有dispose方法的报错
    if (!item.isCSS3DObject) {
      item.geometry.dispose();
      item.material.dispose();
    }
    group.remove(item);
  });
};

// 纹理贴图
const setMaterialCube = (info) => {
  clearPrevMark();
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
    else if (item.name === "dom") createDomMark(item);
    else if (item.name === "video") createVideoMark(item);
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
  mesh.name = "mark";
  // 自定义属性,用于点击切换场景
  mesh.userData.attr = targetAttr;
  group.add(mesh);

  // guiMove(mesh);
};

// 与3d物体绑定点击事件
const bindClick = () => {
  const rayCaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  window.addEventListener("click", (ev) => {
    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(pointer, camera);
    const list = rayCaster.intersectObjects(scene.children, true);
    const findItem = list.find((item) => item.object.name === "mark");
    if (findItem) {
      const nextScene = sceneInfo[findItem.object.userData.attr];
      setMaterialCube(nextScene);
    }
  });
};

// 原生dom前进标记
const createDomMark = (infoObj) => {
  const { position, rotation } = infoObj;
  const span = document.createElement("span");
  span.className = "mark-style";
  span.innerHTML = "前进";
  span.style.pointerEvents = "all";
  // 原生dom绑定点击切换场景的事件
  span.addEventListener("click", (e) => {
    infoObj.active(e);
  });
  // 转换3D
  const span3D = new CSS3DObject(span);
  span3D.scale.set(1 / 800, 1 / 800, 1 / 800);
  span3D.position.set(...position);
  span3D.rotation.set(...rotation);
  group.add(span3D);
};

// 创建视频标记
const createVideoMark = (infoObj) => {
  const { imgUrl, wh, position, rotation } = infoObj;
  const video = document.createElement("video");
  video.muted = false;
  video.src = imgUrl;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  const plane = new THREE.PlaneGeometry(...wh);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.VideoTexture(video),
  });
  const mesh = new THREE.Mesh(plane, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
};

const cube = createCube();
setMaterialCube(sceneInfo.one);
bindClick();
