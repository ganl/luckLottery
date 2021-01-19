var table = [];

const ROTATE_TIME = 8000;
const column_num = 26;

let position = {}
let camera, scene, renderer, controls, composer;
var hblur, vblur;
let targets = {simple: [], table: [], sphere: [], helix: [], grid: []};

var tweenRotation = null;

function init() {

  table = users;

  initCamera();

  initScene();

  initObjects();

  addClickListeners();

  initRenderer();

  initTrackbarControls();

  transform(targets.table, 2000);

  window.addEventListener('resize', onWindowResize, false);

}

function initCamera() {

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  // camera.position.y = 1000;
  camera.position.z = 3500;

}

function initScene() {

  scene = new THREE.Scene();

  //坐标轴辅助  
  var axes = new THREE.AxisHelper(500);
  scene.add(axes);
  var ambient = new THREE.AmbientLight( 0x444444 );
  scene.add( ambient );
}

function initRenderer() {

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);
}

function initObjects() {

  simpleObjectsLayout();
  generateGeometricLayouts();

}

function addClickListeners() {

  addClickListener(targets.table, 'table');
  addClickListener(targets.sphere, 'sphere');
  addClickListener(targets.helix, 'helix');
  addClickListener(targets.grid, 'grid');

}

function simpleObjectsLayout() {

  position = {
    x: (140 * column_num - 280) / 2,
    y: (180 * Math.ceil(table.length / column_num) - 180) / 2
  };
  for (let i = 0; i < table.length; i++) {
      console.log('index: ' + i + ', item: ' + table[i].name)
      let object = new THREE.CSS3DObject(htmlElement(table[i], i));
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;

      scene.add(object);
      targets.simple.push(object);

      // 计算在表格中的行列
      let row = Math.floor(i / column_num) + 1;
      let col = i % column_num + 1;
      console.log(i, row, col);
      tableLayout(row, col);
  }
}

function htmlElement(item, index) {
  let element = document.createElement('div');
  element.className = 'element';
  element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

  let number = document.createElement('div');
  number.className = 'number';
  number.textContent = item.gonghao + ' ' + item.name;
  element.appendChild(number);

  let symbol = document.createElement('div');
  symbol.className = 'symbol';
  symbol.textContent = item.name;
  symbol.style.cssText = 'width:100%;height:75%;background: url(/img/avatar/'+item.avatar+') no-repeat;background-size: cover;opacity: 0.8;text-indent: 100%;white-space: nowrap;overflow: hidden;';
  element.appendChild(symbol);

  let details = document.createElement('div');
  details.className = 'details';
  details.innerHTML = '<br>'; // + item.name
  element.appendChild(details);

  element.addEventListener('click', () => elementClickHandler(index), false);

  return element;
}

function elementClickHandler(i){
  transform(targets.table, 1000);

  new TWEEN.Tween(targets.simple[i].position)
      .to({
          x: 0,
          y: 0,
          z: 2500
      }, Math.random() * 2000 + 2000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  new TWEEN.Tween(this)
      .to({}, 2000 * 2)
      .onUpdate(render)
      .start();
}

function tableLayout(row, col) {

  let object = new THREE.Object3D();

  object.position.x = (col * 140) - position.x; // 1330
  object.position.y = -(row * 180) + position.y; // 990
  targets.table.push(object);
}

function addClickListener(target, elementId) {
  const button = document.getElementById(elementId);
  button.addEventListener('click', function () {
    // if (typeof timer != "undefined") {
    //   clearInterval(timer);
    // }
    transform(target, 2000);
  }, false);
}

function initTrackbarControls() {
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);
}

function generateGeometricLayouts() {

  let sphereVector = new THREE.Vector3();
  let helixVector = new THREE.Vector3();

  for (let i = 0, l = targets.simple.length; i < l; i++) {
      addSphereObject(sphereVector, i, l);
      addHelixObject(helixVector, i);
      addGridObject(i);
  }

}

function addSphereObject(sphereVector, index, length) {

  const phi = Math.acos(-1 + (2 * index) / length);
  const theta = Math.sqrt(length * Math.PI) * phi;
  let object = new THREE.Object3D();

  object.position.setFromSphericalCoords(800, phi, theta);

  sphereVector.copy(object.position).multiplyScalar(2);

  object.lookAt(sphereVector);

  targets.sphere.push(object);
}

function addHelixObject(helixVector, index) {

  const theta = index * 0.175 + Math.PI;
  const y = -(index * 8) + 450;
  let object = new THREE.Object3D();

  object.position.setFromCylindricalCoords(900, theta, y);

  helixVector.x = object.position.x * 2;
  helixVector.y = object.position.y;
  helixVector.z = object.position.z * 2;

  object.lookAt(helixVector);

  targets.helix.push(object);
}

function addGridObject(index) {

  let object = new THREE.Object3D();
  object.position.x = ((index % 5) * 400) - 800;
  object.position.y = (-(Math.floor(index / 5) % 5) * 400) + 800;
  object.position.z = (Math.floor(index / 25)) * 1000 - 2000;
  targets.grid.push(object);

}

function transform(target, duration) {

  TWEEN.removeAll();

  for (let i = 0; i < targets.simple.length; i++) {
      let object = targets.simple[i];
      let targetObject = target[i];
      transformObjectPosition(object, targetObject, duration);
      transformObjectRotation(object, targetObject, duration);
  }

  new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start();

}

function transformObjectPosition(object, targetObject, duration) {

  new TWEEN.Tween(object.position)
      .to({
          x: targetObject.position.x,
          y: targetObject.position.y,
          z: targetObject.position.z
      }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

}

function transformObjectRotation(object, targetObject, duration) {

  new TWEEN.Tween(object.rotation)
      .to({
          x: targetObject.rotation.x,
          y: targetObject.rotation.y,
          z: targetObject.rotation.z
      }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();

}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
  // composer.render();
}

function rotateBall() {
  
  // transform(targets.sphere, 1000);

  scene.rotation.y = 0;
  camera.position.z = 2500; // 离近点，让球大点
  tweenRotation = new TWEEN.Tween(scene.rotation)
    .to(
      {
        y: Math.PI * 8
      },
      ROTATE_TIME
    )
    .onUpdate(render)
    .easing(TWEEN.Easing.Exponential.InOut)
    .start()
    .onComplete(() => {
      if (running) { // index.js
        console.log('completed, run again')
        rotateBall();
      }
    });

  // new TWEEN.Tween(targets.simple[4].position)
  // .to({
  //     x: 0,
  //     y: 0,
  //     z: 2500
  // }, Math.random() * 2000 + 2000)
  // .easing(TWEEN.Easing.Exponential.InOut)
  // .start();

  // new TWEEN.Tween(this)
  //     .to({}, 2000 * 2)
  //     .onUpdate(render)
  //     .start();
}

function setRotationY (y = 0) {
    scene.rotation.y = y;
    camera.position.z = 2500;
}

function autoRotate() {
  scene.rotateY(0.05);//每次绕y轴旋转0.05弧度
  render();
}
