const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const selfLight = new THREE.PointLight(0xc592ff, 2, 100);
scene.add(selfLight);

const self = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x9775fa })
);
scene.add(self);

const moduleData = [
  { name: '任务', size: 0.35, orbit: 3,    color: 0xff6b6b, orbitSpeed: 0.020, spinSpeed: 0.020, ring: false },
  { name: '学习', size: 0.45, orbit: 4.2,  color: 0xffa94d, orbitSpeed: 0.016, spinSpeed: 0.018, ring: false },
  { name: '课程', size: 0.55, orbit: 5.5,  color: 0x4dabf7, orbitSpeed: 0.013, spinSpeed: 0.015, ring: false },
  { name: '留言', size: 0.70, orbit: 7.5,  color: 0x51cf66, orbitSpeed: 0.008, spinSpeed: 0.012, ring: true  }
];

const modules = [];

moduleData.forEach(d => {
  const pivot = new THREE.Group();
  scene.add(pivot);
  const module = new THREE.Mesh(
    new THREE.SphereGeometry(d.size, 32, 32),
    new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.8 })
  );
  module.position.x = d.orbit;
  pivot.add(module);
  if (d.ring) {
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(d.size * 1.4, d.size * 2.2, 48),
      new THREE.MeshBasicMaterial({ color: 0xa3f7bf, side: THREE.DoubleSide })
    );
    ringMesh.rotation.x = Math.PI / 2.4;
    module.add(ringMesh);
  }
  modules.push({ pivot, module, d });
});

const starCount = 4000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 60 + Math.random() * 60;
  starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.cos(phi);
  starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
);
scene.add(stars);

const animate = () => {
  requestAnimationFrame(animate);
  self.rotation.y += 0.004;
  stars.rotation.y += 0.0003;
  modules.forEach(p => {
    p.pivot.rotation.y += p.d.orbitSpeed;
    p.module.rotation.y += p.d.spinSpeed;
  });
  controls.update();
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});