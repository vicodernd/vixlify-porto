/* ============ NEXUS — Three.js scenes ============ */
import * as THREE from "three";

const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* shared mouse state (normalized -1..1) */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
});

/* =====================================================
   SCENE 1 — Hero dust particles (drifting embers)
===================================================== */
(function heroParticles() {
  const canvas = document.getElementById("hero-particles");
  if (!canvas || isReduced) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 10;

  const COUNT = isMobile ? 120 : 320;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    speeds[i] = 0.15 + Math.random() * 0.5;
    sizes[i] = 1 + Math.random() * 2.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.3 + position.x * 0.5) * 0.4;
        p.x += cos(uTime * 0.2 + position.y * 0.4) * 0.3;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * (8.0 / -mv.z);
        vAlpha = smoothstep(10.0, 2.0, -mv.z) * 0.55 + 0.1;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(0.91, 0.62, 0.34, a);
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    points.rotation.y = mouse.x * 0.12;
    points.rotation.x = -mouse.y * 0.08;
    renderer.render(scene, camera);
  });
})();

/* =====================================================
   SCENE 2 — "Form Follows Vision" wireframe structure
   A procedural tower of stacked, twisted floor slabs
===================================================== */
(function structureScene() {
  const canvas = document.getElementById("structure-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0b0a, 14, 34);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 2.2, 17);

  const group = new THREE.Group();
  scene.add(group);

  /* --- twisted tower of floor slabs --- */
  const FLOORS = 26;
  const slabGeo = new THREE.BoxGeometry(5.2, 0.12, 5.2);
  const edgeGeo = new THREE.EdgesGeometry(slabGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xe9e4da, transparent: true, opacity: 0.34 });
  const accentMat = new THREE.LineBasicMaterial({ color: 0xd98e4a, transparent: true, opacity: 0.95 });
  const fillMat = new THREE.MeshBasicMaterial({ color: 0x0b0b0a, transparent: true, opacity: 0.55 });

  const slabs = [];
  for (let i = 0; i < FLOORS; i++) {
    const t = i / (FLOORS - 1);
    const slab = new THREE.Group();

    const fill = new THREE.Mesh(slabGeo, fillMat);
    const edges = new THREE.LineSegments(edgeGeo, i % 6 === 0 ? accentMat : lineMat);
    slab.add(fill, edges);

    slab.position.y = i * 0.46 - (FLOORS * 0.46) / 2;
    const s = 1 - Math.sin(t * Math.PI) * 0.28;
    slab.scale.set(s, 1, s);
    slab.userData.baseY = slab.position.y;
    slab.userData.baseTwist = t * Math.PI * 0.5;
    slab.rotation.y = slab.userData.baseTwist;

    slabs.push(slab);
    group.add(slab);
  }

  /* --- vertical spine columns --- */
  const colMat = new THREE.LineBasicMaterial({ color: 0xe9e4da, transparent: true, opacity: 0.16 });
  const spine = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2;
    const pts = [];
    for (let i = 0; i < FLOORS; i++) {
      const t = i / (FLOORS - 1);
      const s = (1 - Math.sin(t * Math.PI) * 0.28) * 2.4;
      const twist = t * Math.PI * 0.5 + a;
      pts.push(new THREE.Vector3(Math.cos(twist) * s, i * 0.46 - (FLOORS * 0.46) / 2, Math.sin(twist) * s));
    }
    spine.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), colMat));
  }
  group.add(spine);

  /* --- ground grid --- */
  const grid = new THREE.GridHelper(40, 40, 0x33302c, 0x1c1a18);
  grid.position.y = -(FLOORS * 0.46) / 2 - 0.4;
  scene.add(grid);

  /* --- scroll progress drives twist + camera --- */
  let scrollProgress = 0;
  const section = document.getElementById("structure");
  function updateScroll() {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    scrollProgress = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
  }
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);

  let smooth = 0;
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const t = clock.getElapsedTime();
    smooth += (scrollProgress - smooth) * 0.06;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // tower breathes + twists with scroll
    slabs.forEach((slab, i) => {
      const ti = i / (FLOORS - 1);
      slab.rotation.y = slab.userData.baseTwist + smooth * Math.PI * 1.1 * ti + (isReduced ? 0 : Math.sin(t * 0.4 + ti * 3) * 0.03);
    });

    group.rotation.y = mouse.x * 0.45 + t * 0.05;
    group.rotation.x = -mouse.y * 0.12;
    camera.position.y = 2.2 - smooth * 3.4;
    camera.position.z = 17 - smooth * 3.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  });
})();
