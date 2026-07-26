import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mattressLayers } from '../data/layers.js';

export default function MattressExploded({ onLayerClick, activeLayerId, className = '' }) {
  const mountRef = useRef(null);
  const meshesRef = useRef([]);
  const activeLayerRef = useRef(activeLayerId);

  useEffect(() => {
    activeLayerRef.current = activeLayerId;
  }, [activeLayerId]);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 3.5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffe08a, 2.2);
    key.position.set(6, 10, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.PointLight(0x00d9ff, 0.5, 20);
    fill.position.set(-6, 2, -4);
    scene.add(fill);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const meshes = [];

    mattressLayers.forEach((layer) => {
      const thicknessNum = parseFloat(layer.thickness) / 8;
      const geo = new THREE.BoxGeometry(4.2, Math.max(thicknessNum, 0.14), 2.6, 2, 1, 2);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(layer.color),
        roughness: 0.5,
        metalness: 0.08,
        clearcoat: 0.2,
        transparent: true,
        opacity: 0.97
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = layer.yOffset;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { id: layer.id, baseY: layer.yOffset, phase: Math.random() * Math.PI * 2 };
      scene.add(mesh);
      meshes.push(mesh);
    });
    meshesRef.current = meshes;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 16;
    controls.target.set(0, 0, 0);

    function onPointerMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function handlePick(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length && onLayerClick) {
        onLayerClick(hits[0].object.userData.id);
      }
    }

    function onClick(e) {
      handlePick(e.clientX, e.clientY);
    }
    function onTouchEnd(e) {
      if (e.changedTouches?.length) {
        const t = e.changedTouches[0];
        handlePick(t.clientX, t.clientY);
      }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('touchend', onTouchEnd);
16:46
let raf;
    let running = true;
    const clock = new THREE.Clock();
    function animate() {
      if (!running) return;
      const t = clock.getElapsedTime();
      meshes.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(t * 0.8 + m.userData.phase) * 0.06;
        const isActive = m.userData.id === activeLayerRef.current;
        const targetScale = isActive ? 1.04 : 1;
        m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        m.material.emissive = new THREE.Color(isActive ? 0xf4c430 : 0x000000);
        m.material.emissiveIntensity = isActive ? 0.25 : 0;
      });
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function handleVisibility() {
      running = document.visibilityState === 'visible';
      if (running) {
        clock.start();
        animate();
      } else {
        cancelAnimationFrame(raf);
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLayerClick]);

  return <div ref={mountRef} className={w-full h-full cursor-grab active:cursor-grabbing ${className}} />;
}
