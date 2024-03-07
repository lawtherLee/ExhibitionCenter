// 初始化环境
import * as THREE from "three";
import { CSS3DRenderer, OrbitControls } from "three/addons";

export let scene, camera, renderer, controls, css3DRenderer;

(function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 0.1;
  renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
})();

// 轨道控制器
(function createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
})();

(function createHelper() {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
})();

(function create3dRenderer() {
  css3DRenderer = new CSS3DRenderer();
  css3DRenderer.setSize(window.innerWidth, window.innerHeight);
  css3DRenderer.domElement.style.position = "fixed";
  css3DRenderer.domElement.style.left = "0";
  css3DRenderer.domElement.style.top = "0";
  css3DRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(css3DRenderer.domElement);
})();

(function resizeRender() {
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

// 循环渲染
(function renderLoop() {
  renderer.render(scene, camera);
  controls.update();
  css3DRenderer.render(scene, camera);
  // 根据计算机浏览器刷新帧率，递归调用
  requestAnimationFrame(renderLoop);
})();
