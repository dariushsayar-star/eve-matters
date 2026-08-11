import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var SEGMENTS = [
  { id: 'head', x: 2.6, z: 0, type: 'sphere', r: 0.4, heat: 0.15 },
  { id: 'neck', x: 2.05, z: 0, type: 'cylinder', r: 0.22, h: 0.5, heat: 0.3 },
  { id: 'shoulderL', x: 1.6, z: -0.5, type: 'sphere', r: 0.28, heat: 0.55 },
  { id: 'shoulderR', x: 1.6, z: 0.5, type: 'sphere', r: 0.28, heat: 0.55 },
  { id: 'upperArmL', x: 1.0, z: -0.75, type: 'capsule', r: 0.16, h: 0.9, heat: 0.3 },
  { id: 'upperArmR', x: 1.0, z: 0.75, type: 'capsule', r: 0.16, h: 0.9, heat: 0.3 },
  { id: 'forearmL', x: 0.1, z: -0.78, type: 'capsule', r: 0.14, h: 0.9, heat: 0.25 },
  { id: 'forearmR', x: 0.1, z: 0.78, type: 'capsule', r: 0.14, h: 0.9, heat: 0.25 },
  { id: 'upperBack', x: 1.0, z: 0, type: 'capsule', r: 0.55, h: 1.0, heat: 0.75 },
  { id: 'lowerBack', x: -0.05, z: 0, type: 'capsule', r: 0.5, h: 1.0, heat: 0.9 },
  { id: 'hips', x: -1.1, z: 0, type: 'capsule', r: 0.5, h: 0.9, heat: 0.55 },
  { id: 'thighL', x: -2.0, z: -0.32, type: 'capsule', r: 0.22, h: 1.1, heat: 0.35 },
  { id: 'thighR', x: -2.0, z: 0.32, type: 'capsule', r: 0.22, h: 1.1, heat: 0.35 },
  { id: 'kneeL', x: -2.75, z: -0.32, type: 'sphere', r: 0.2, heat: 0.25 },
  { id: 'kneeR', x: -2.75, z: 0.32, type: 'sphere', r: 0.2, heat: 0.25 },
  { id: 'shinL', x: -3.4, z: -0.3, type: 'capsule', r: 0.17, h: 1.0, heat: 0.18 },
  { id: 'shinR', x: -3.4, z: 0.3, type: 'capsule', r: 0.17, h: 1.0, heat: 0.18 },
  { id: 'feet', x: -4.15, z: 0, type: 'sphere', r: 0.3, heat: 0.15 }
];

var HEAT_STOPS = [
  { stop: 0, color: 0x2563eb },
  { stop: 0.25, color: 0x00d9ff },
  { stop: 0.45, color: 0x4ade80 },
  { stop: 0.65, color: 0xfacc15 },
  { stop: 0.8, color: 0xff9500 },
  { stop: 0.92, color: 0xff3b30 },
  { stop: 1, color: 0xffffff }
];

var IDLE_COLOR = 0x14202c;
var SCAN_MIN_X = -4.4;
var SCAN_MAX_X = 3.0;

function heatColor(t) {
  var clamped = Math.max(0, Math.min(1, t));
  for (var i = 0; i < HEAT_STOPS.length - 1; i++) {
    var a = HEAT_STOPS[i];
    var b = HEAT_STOPS[i + 1];
    if (clamped >= a.stop && clamped <= b.stop) {
      var localT = (clamped - a.stop) / (b.stop - a.stop || 1);
      var colorA = new THREE.Color(a.color);
      var colorB = new THREE.Color(b.color);
      return colorA.lerp(colorB, localT);
    }
  }
  return new THREE.Color(HEAT_STOPS[HEAT_STOPS.length - 1].color);
}

function highlightIdsForConcern(concern) {
  if (concern === 'back' || concern === 'lordosis' || concern === 'discPressure') {
    return ['lowerBack'];
  }
  if (concern === 'neck') {
    return ['neck'];
  }
  if (concern === 'shoulder') {
    return ['shoulderL', 'shoulderR'];
  }
  return [];
}

export default function BodyScan3D(props) {
  var mountRef = useRef(null);
  var stateRef = useRef({ phase: props.phase, progress: props.progress, concern: props.concern });

  useEffect(function () {
    stateRef.current = { phase: props.phase, progress: props.progress, concern: props.concern };
  }, [props.phase, props.progress, props.concern]);

  useEffect(function () {
    var mount = mountRef.current;
    var width = mount.clientWidth;
    var height = mount.clientHeight;
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x030507, 8, 20);

    var camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 6.8);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x6688aa, 0.55));

    var keyLight = new THREE.SpotLight(0x9fe0ff, 3.4, 30, Math.PI / 4.2, 0.5, 1.1);
    keyLight.position.set(2, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);

    var rimLight = new THREE.PointLight(0xf4c430, 0.6, 20);
    rimLight.position.set(-3, 3, -4);
    scene.add(rimLight);

    var floorGeo = new THREE.CircleGeometry(6.5, 64);
    var floorMat = new THREE.MeshStandardMaterial({ color: 0x040608, roughness: 0.2, metalness: 0.6 });
    var floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    floor.receiveShadow = true;
    scene.add(floor);

    var grid = new THREE.GridHelper(11, 22, 0x00d9ff, 0x0a2230);
    grid.position.y = -0.84;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    var ringGeo = new THREE.RingGeometry(4.6, 4.68, 80);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.83;
    scene.add(ring);

    var segmentGroup = new THREE.Group();
    var meshMap = {};
    SEGMENTS.forEach(function (seg) {
      var geo;
      if (seg.type === 'sphere') {
        geo = new THREE.SphereGeometry(seg.r, 24, 20);
      } else if (seg.type === 'cylinder') {
        geo = new THREE.CylinderGeometry(seg.r, seg.r, seg.h, 20);
      } else {
        geo = new THREE.CapsuleGeometry(seg.r, seg.h, 6, 16);
      }
      var mat = new THREE.MeshPhysicalMaterial({
        color: IDLE_COLOR,
        emissive: new THREE.Color(IDLE_COLOR),
        emissiveIntensity: 0.4,
        roughness: 0.45,
        metalness: 0.1,
        clearcoat: 0.3
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(seg.x, 0, seg.z);
      if (seg.type === 'capsule' || seg.type === 'cylinder') {
        mesh.rotation.z = Math.PI / 2;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      segmentGroup.add(mesh);
      meshMap[seg.id] = mesh;
    });
    scene.add(segmentGroup);

    var haloMap = {};
    SEGMENTS.forEach(function (seg) {
      var haloGeo = new THREE.SphereGeometry(seg.r + 0.18, 20, 16);
      var haloMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0, wireframe: true });
      var halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(seg.x, 0, seg.z);
      scene.add(halo);
      haloMap[seg.id] = halo;
    });

    var scanGeo = new THREE.PlaneGeometry(0.5, 3.4);
    var scanMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    var scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.y = Math.PI / 2;
    scanPlane.visible = false;
    scene.add(scanPlane);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, -0.2, 0);

    var raf;
    var running = true;
    var clock = new THREE.Clock();

    function animate() {
      if (!running) {
        return;
      }
      var t = clock.getElapsedTime();
      var current = stateRef.current;
      var phase = current.phase;
      var progress = current.progress || 0;
      var highlightIds = highlightIdsForConcern(current.concern);

      var scanX = SCAN_MIN_X + ((SCAN_MAX_X - SCAN_MIN_X) * progress) / 100;

      SEGMENTS.forEach(function (seg) {
        var mesh = meshMap[seg.id];
        var revealed = phase === 'done' || (phase === 'scanning' && scanX >= seg.x);
        var targetColor = revealed ? heatColor(seg.heat) : new THREE.Color(IDLE_COLOR);
        mesh.material.color.lerp(targetColor, 0.08);
        mesh.material.emissive.lerp(targetColor, 0.08);
        mesh.material.emissiveIntensity = revealed ? 0.55 : 0.25;
      });

      Object.keys(haloMap).forEach(function (id) {
        var halo = haloMap[id];
        var isHighlighted = highlightIds.indexOf(id) !== -1;
        var targetOpacity = isHighlighted ? 0.35 + 0.35 * Math.sin(t * 3) : 0;
        halo.material.opacity += (targetOpacity - halo.material.opacity) * 0.15;
        var scale = isHighlighted ? 1 + 0.06 * Math.sin(t * 3) : 1;
        halo.scale.setScalar(scale);
      });

      if (phase === 'scanning') {
        scanPlane.visible = true;
        scanPlane.position.x = scanX;
        scanMat.opacity = 0.3 + 0.15 * Math.sin(t * 6);
      } else {
        scanPlane.visible = false;
      }

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
      var w = mount.clientWidth;
      var h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    var resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return function cleanup() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
