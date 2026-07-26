import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Interactive 3D mattress viewer: mouse/touch rotation, pinch/scroll zoom,
 * soft shadows and a reflective floor. Built with vanilla Three.js so it
 * stays framework-agnostic and lightweight.
 */
export default function MattressViewer({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x050505, 12, 26);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(6, 4.5, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lighting: key gold light + soft blue fill + ambient
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.SpotLight(0xffe08a, 4.2, 30, Math.PI / 5, 0.4, 1.2);
    keyLight.position.set(6, 9, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x00d9ff, 0.6, 20);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    // Mattress group (stacked box layers for a believable silhouette)
    const mattress = new THREE.Group();
    const layerDefs = [
      { h: 0.16, color: 0xf5f1e6, w: 4.2, d: 2.6 },
      { h: 0.5, color: 0xe8dcc0, w: 4.2, d: 2.6 },
      { h: 0.5, color: 0xf4c430, w: 4.15, d: 2.55 },
      { h: 0.4, color: 0xd8b46a, w: 4.15, d: 2.55 },
      { h: 1.4, color: 0x9ca3af, w: 4.1, d: 2.5 },
      { h: 0.16, color: 0x3a3a3d, w: 4.2, d: 2.6 }
    ];
    let y = 0;
    layerDefs.forEach((l) => {
      const geo = new THREE.BoxGeometry(l.w, l.h, l.d, 2, 1, 2);
      const mat = new THREE.MeshPhysicalMaterial({
        color: l.color,
        roughness: 0.55,
        metalness: 0.05,
        clearcoat: 0.15,
        clearcoatRoughness: 0.6
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = y + l.h / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mattress.add(mesh);
      y += l.h;
    });
    mattress.position.y = -y / 2;
    scene.add(mattress);

    // Reflective-feeling floor
    const floorGeo = new THREE.CircleGeometry(9, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.15,
      metalness: 0.7
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -y / 2 - 0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle gold ring accent on the floor
    const ringGeo = new THREE.RingGeometry(3.6, 3.66, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf4c430, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -y / 2 - 0.01;
    scene.add(ring);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.target.set(0, -0.2, 0);

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      keyLight.intensity = 4 + Math.sin(t * 1.4) * 0.3;
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

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
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
}
