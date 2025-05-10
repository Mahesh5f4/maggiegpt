import { useEffect } from 'react';
import * as THREE from 'three';

const createScene = (container) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
};

const ThreeDScene = () => {
  useEffect(() => {
    const container = document.getElementById('threeDScene');
    createScene(container);
  }, []);

  return <div id="threeDScene" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>;
};

export default ThreeDScene;
