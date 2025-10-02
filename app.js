import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

// Grab container
const container = document.getElementById('container3D');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Camera state
let isZoomedIn = false;
let savedCameraPos = new THREE.Vector3();
let savedTarget = new THREE.Vector3();
let currentPointIndex = 2;

// Array to store zoom points
const zoomPoints = [];

// Load Model
const loader = new GLTFLoader();
loader.load(
  'the_morning_room-(1).glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Get bounding box
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('Room center:', center);
    console.log('Room size:', size);

    // Place camera inside room
   // Place camera at the new artwork position
    camera.position.set(1.006, 1.336, -0.114);
    controls.target.set(0.407, 1.385, -0.055);
    controls.update();
    
    // Save initial position
    savedCameraPos.copy(camera.position);
    savedTarget.copy(controls.target);
    
    // Create zoom points
    createZoomPoints(center, size);
    
    // Create instruction box
    createInstructionBox();
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
  (err) => console.error('Error loading model:', err)
);

//---------------------------------------- TEXT AANPASSEN HIER ------------------------------------------------------------
function createZoomPoints(center, size) {
  // Define zoom point positions and information
  const pointsData = [
    {
      position: new THREE.Vector3(1.006, 1.336, -0.114),
      lookAt: new THREE.Vector3(0.407, 1.385, -0.055),
      name: "Vergelijking met klasgenoten", // Titel van het werk
       info: "Als ik mijn ervaringen vergelijk met die van mijn klasgenoten merk ik dat we paar dingen verschillend doen. Ik neem bijvoorbeeld mijn tijd om foto’s te maken en rond te kijken terwijl anderen er snel door heen gaan. Ook gaan andere klasgenoten naar wat drukkere plekken om foto’s te maken wat ik zelf niet zo snel doe. Anderen denken dat ik misschien te rustig of voorzichtig ben. Waar we het over eens mee zijn is dat sommige ervaringen zoals het Colosseum of de bioscoop erg bijzonder en leuk zijn. Waar we weer in verschillen is vooral hoe we die momenten beleven en waarop we letten. Zo door andere hun beeld te hebben en begrijpen kan ik er ook van leren.",
      isArtwork: true
    },
    {
        position: new THREE.Vector3(2.724, 2.062, 0.846),
        lookAt: new THREE.Vector3(7.770, 2.359, -1.409),
        name: "Citadella Toren",
        info: "In klas 3 ben ik samen met twee klassen naar Malta geweest. Tijdens die reis hebben we veel dingen gedaan en bezocht. Een van die activiteiten was het bezoeken van de Citadella Toren op het eiland Gozo. Dit is een heel oud kasteel dat een belangrijke rol speelde in de geschiedenis van het eiland. Wat mij meteen opviel, was dat er nog echte kanonnen stonden. Dat vond ik heel bijzonder en cool om te zien, omdat je je zo beter kan voorstellen van hoe het vroeger nou eigenlijk was. Ook kregen we een rondleiding in het kasteel. Tijdens die tour kregen veel informatie over de geschiedenis van Citadella. Daardoor kreeg ik een beter beeld van hoe belangrijk dit gebouw was en waarom het nu nog steeds zo bijzonder is. ",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(3.006, 3.334, 0.484),
        lookAt: new THREE.Vector3(7.967, 3.131, -1.247),
        name: "Greeting to the Sea",
        info: "Ik ben met mijn ouders naar Kroatië geweest. We hebben veel verschillende dingen gedaan en gezien. Wat ik echt het allermooist vond, was het zien van de zonsondergang bij Greeting to the Sea in Zadar. Dit is een bijzondere plek aan zee waar je niet alleen de mooie kleuren van de zon ziet, maar ook het geluid die de Sea Organ maakt. Die maken muziek van de golven van het water, en dat klonk geweldig terwijl de zon onder ging. Die avond regende het een beetje, maar dat maakte het juist grappig om te zien hoe mensen van hun droge plek naar de kant van de zee rende om toch foto's te maken. Ik vind het zelf heel leuk om foto's te maken van zonsondergangen, en ondanks de regen had ik een perfecte kans om dat te doen. De roze en oranje kleuren van de lucht en hoe het reflecteerde op het water was prachtig. Ik vond dit een hele mooie ervaring. ",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.356, 2.501, -0.712),
        lookAt: new THREE.Vector3(-3.259, 2.551, -2.794),
        name: "Fotografie",
        info: "This striking piece represents the artist's exploration of memory and identity. Inspired by childhood recollections of summer afternoons, the vibrant colors and bold brushstrokes create a sense of nostalgia while simultaneously challenging our perception of remembered spaces. The painting took over six months to complete as layers were continuously added and refined.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.508, 2.264, 2.289),
        lookAt: new THREE.Vector3(-2.265, 2.312, 2.584),
        name: "Colosseum",
        info: "Ik ben met mijn familie naar Italië geweest en we hebben daar het Colosseum bezocht. Van buiten zag het er heel mooi en indrukwekkend uit. Alleen waren ze in de tijd dat wij er waren bezig met verbouwingen, waardoor het iets minder aantrekkelijk uitzag. Toen we eenmaal binnen waren, was ik best verast. Ik had verwacht dat er meer te zien zou zijn, maar het was eigenlijk vrij leeg. Er stonden wel paar maquettes die lieten zien hoe het er vroeger uitzag. Ook kon je beneden bij de muren naar binnen, maar dat hebben wij niet gedaan. Toch vond ik het een bijzondere ervaring. Het was best druk, maar je kon er wel mooie foto's maken en het voelde speciaal om op zon beroemde en historische plek te staan.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.785, 3.486, 2.401),
        lookAt: new THREE.Vector3(-2.195, 3.490, 2.559),
        name: "The Birth of Venus",
        info: "Toen ik in Italië was heb ik ook museums bezocht. In een van de museums heb ik het schilderij The Birth of Venus gezien van Bottecelli. Ik vond de kleuren heel mooi en het licht laat bijna het schilderij glanzen. Ook zag ik dat de contrasten tussen de figuren en achtergrond diepte gaf aan het schilderij. Ik vind het knap hoe Botticelli door, licht en vorm een soort gevoel kan over brengen met alle details. Dit schilderij liet me zien dat je geen woorden nodig hebt om een emotie of gevoel te willen overbrengen.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.876, 3.409, -0.695),
        lookAt: new THREE.Vector3(-3.353, 3.419, -0.508),
        name: "Film",
        info: "Ik ga graag naar de bioscoop, meestal met vrienden of mijn broers. Ik vind het leuk om een film op het grote scherm te zien. Dat maakt het veel leuker dan het kijken op je eigen tv. Het geluid en beelden zijn ook veel beter in de bioscoop dan thuis wat het speciaal maakt. Naar de bioscoop gaan is voor mij een leuke manier om te ontspannen en even iets anders te doen. Ook is het altijd gezellig sinds je samen lacht of schrikt bij sommige scenes. Mijn favoriete filmgenres zijn comedy, actie en mysterie. Daar kijk ik ook echt het liefst naar.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(1.186, 2.882, -1.236),
        lookAt: new THREE.Vector3(1.286, 2.882, -1.426),
        name: "Maria bedevaartsoord in Banneux",
        info: "Ik ben met mijn familie naar Maria bedevaartsoord in Banneux geweest. Dit is een grote kerk in België waar wij bijna elk jaar naartoe gaan. Voor mijn ouders is dit een hele bijzondere plek dus daarom dat we er steeds heen gaan.  Elke keer dat ik daar kom, voel ik een soort rust. Het is vaak stil rond in en rond de kerk, en dat geeft mij de kans om even helemaal tot mezelf te komen. Dat rustgevende gevoel maakt mijn ervaring in deze kerk telkens weer speciaal en ook onvergetelijk. Het is bijzonder om te zien hoeveel mensen daar eigenlijk heen gaan met hun eigen redenen.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(0.734, 2.728, -2.264),
        lookAt: new THREE.Vector3(0.670, 2.727, -2.410),
        name: "Muziek",
        info: "Ik luister heel veel naar muziek op Spotify van alerlei verschillende artiesten. Het hangt af van hoe ik me voel en waar ik zin in heb. Soms luister ik naar rustige nummers van Brent Faiyaz of Daniel Caeser, hun maken vooral R&B muziek. Dat luister ik meestal als ik naar school ga, huiswerk maak of teken. Andere keren luister ik naar wat vrolijker muziek zoals van The Weeknd en Rihanna, hun maken veel Popmuziek. Dat luister ik vooral als ik iets actiefs doe of met vrienden ben. Ik combineer muziek met wat ik ook doe, dat maakt het wat je ook doet een stuk leuker voor mij.",
        isArtwork: true
      },
  ];
  
  // Create markers for each zoom point
  pointsData.forEach((point, index) => {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7
    });
    
    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(point.position);
    marker.userData = {
      index: index,
      name: point.name,
      info: point.info,
      lookAt: point.lookAt,
      isArtwork: point.isArtwork || false
    };
    
    // Set color based on whether it's an artwork or not
    if (point.isArtwork) {
      marker.material.color.set(0xff6600); // Orange for artworks
    }
    
    scene.add(marker);
    zoomPoints.push(marker);
    
    console.log(`Created zoom point: ${point.name}`);
  });
}

// Function to log camera position
function logCameraPosition() {
  const position = camera.position.clone();
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  
  // Calculate a point 2 units ahead in the direction the camera is facing
  const lookAtPoint = position.clone().add(direction.multiplyScalar(2));
  
  console.log({
    position: {
      x: parseFloat(position.x.toFixed(3)),
      y: parseFloat(position.y.toFixed(3)),
      z: parseFloat(position.z.toFixed(3))
    },
    lookingAt: {
      x: parseFloat(lookAtPoint.x.toFixed(3)),
      y: parseFloat(lookAtPoint.y.toFixed(3)),
      z: parseFloat(lookAtPoint.z.toFixed(3))
    },
    controlsTarget: {
      x: parseFloat(controls.target.x.toFixed(3)),
      y: parseFloat(controls.target.y.toFixed(3)),
      z: parseFloat(controls.target.z.toFixed(3))
    }
  });
}

// Function to add a new artwork zoom point
function addArtworkZoomPoint(name, info) {
  const position = camera.position.clone();
  const lookAt = controls.target.clone();
  
  // Create new zoom point data
  const newPointData = {
    position: position,
    lookAt: lookAt,
    name: name,
    info: info
  };
  
  // Create marker for the new zoom point
  const geometry = new THREE.SphereGeometry(0.05, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6600,  // Orange color for artwork points
    transparent: true,
    opacity: 0.7
  });
  
  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(position);
  marker.userData = {
    index: zoomPoints.length,
    name: name,
    info: info,
    lookAt: lookAt,
    isArtwork: true
  };
  
  scene.add(marker);
  zoomPoints.push(marker);
  
  console.log(`Created new artwork zoom point: ${name}`);
  console.log({
    position: {
      x: parseFloat(position.x.toFixed(3)),
      y: parseFloat(position.y.toFixed(3)),
      z: parseFloat(position.z.toFixed(3))
    },
    lookAt: {
      x: parseFloat(lookAt.x.toFixed(3)),
      y: parseFloat(lookAt.y.toFixed(3)),
      z: parseFloat(lookAt.z.toFixed(3))
    }
  });
  
  // Return the formatted data for easy copy-paste
  return `{
    position: new THREE.Vector3(${position.x.toFixed(3)}, ${position.y.toFixed(3)}, ${position.z.toFixed(3)}),
    lookAt: new THREE.Vector3(${lookAt.x.toFixed(3)}, ${lookAt.y.toFixed(3)}, ${lookAt.z.toFixed(3)}),
    name: "${name}",
    info: "${info}",
    isArtwork: true
  },`;
}

// 360-degree camera rotation functionality
let isRotating = false;
let rotationSpeed = 0.01;
let rotationCenter = new THREE.Vector3();
let rotationRadius = 0;
let rotationAngle = 0;
let rotationAxis = new THREE.Vector3(0, 1, 0); // Default rotation around Y axis

function startRotation() {
  if (isRotating) return; // Already rotating
  
  // Save current position as the center point
  rotationCenter = controls.target.clone();
  
  // Calculate radius based on distance from camera to target
  const cameraToTarget = new THREE.Vector3().subVectors(camera.position, rotationCenter);
  rotationRadius = cameraToTarget.length();
  
  // Calculate initial angle
  rotationAngle = Math.atan2(cameraToTarget.z, cameraToTarget.x);
  
  // Disable controls during rotation
  controls.enabled = false;
  
  // Start rotation
  isRotating = true;
  
  console.log("Starting 360° rotation around point:", rotationCenter);
}

function stopRotation() {
  if (!isRotating) return;
  
  isRotating = false;
  controls.enabled = true;
  console.log("Rotation stopped");
}

function updateRotation() {
  if (!isRotating) return;
  
  // Update angle
  rotationAngle += rotationSpeed;
  
  // Calculate new camera position
  const newX = rotationCenter.x + rotationRadius * Math.cos(rotationAngle);
  const newZ = rotationCenter.z + rotationRadius * Math.sin(rotationAngle);
  
  // Update camera position
  camera.position.x = newX;
  camera.position.z = newZ;
  
  // Keep looking at center
  camera.lookAt(rotationCenter);
  
  // Update controls target
  controls.target.copy(rotationCenter);
  
  // Complete one full rotation (2π radians)
  if (rotationAngle >= rotationAngle + Math.PI * 2) {
    stopRotation();
  }
}

// Handle click and touch events
function handleInteraction(event) {
  // Prevent default behavior for touch events
  if (event.type === 'touchstart') {
    event.preventDefault();
  }
  
  const rect = container.getBoundingClientRect();
  
  // Get coordinates from either mouse click or touch
  let clientX, clientY;
  
  if (event.type === 'touchstart') {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  
  // Convert to normalized device coordinates
  mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  
  // First check if we hit a zoom point
  const pointIntersects = raycaster.intersectObjects(zoomPoints);
  if (pointIntersects.length > 0) {
    const point = pointIntersects[0].object;
    moveToZoomPoint(point);
    return;
  }
  
  // Then check for other objects (paintings)
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const obj = intersects[0].object;

    // Example: paintings should have "painting" in their name
    if (obj.name.toLowerCase().includes("painting")) {
      if (!isZoomedIn) {
        // Save state
        savedCameraPos.copy(camera.position);
        savedTarget.copy(controls.target);

        // Move in front of painting
        const hitPoint = intersects[0].point;
        const normal = intersects[0].face.normal.clone().transformDirection(obj.matrixWorld);
        const newPos = hitPoint.clone().add(normal.multiplyScalar(0.8));

        gsap.to(camera.position, {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(hitPoint),
          onComplete: () => {
            controls.target.copy(hitPoint);
            isZoomedIn = true;
            showPointInfo(obj.name);
          }
        });
      }
    }
  } else if (isZoomedIn) {
    // Return to saved position
    returnToSavedPosition();
  }
}

// Add mouse click event listener
container.addEventListener('click', handleInteraction);

// Add touch event listeners for mobile
container.addEventListener('touchstart', handleInteraction, { passive: false });

// Handle hover effects for desktop
container.addEventListener('mousemove', (event) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  // Update cursor style when hovering over zoom points
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(zoomPoints);
  
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});

// Function to move to a zoom point
function moveToZoomPoint(point) {
  console.log('Moving to zoom point:', point.userData);
  console.log('Point is artwork:', point.userData.isArtwork);
  
  // Save current position if not already zoomed in
  if (!isZoomedIn) {
    savedCameraPos.copy(camera.position);
    savedTarget.copy(controls.target);
  }
  
  isZoomedIn = true;
  currentPointIndex = point.userData.index;
  
  // Highlight the selected point
  zoomPoints.forEach((p, i) => {
    if (i === currentPointIndex) {
      p.material.color.set(0x0088ff); // Blue for selected
      p.material.opacity = 1.0;
    } else {
      p.material.color.set(p.userData.isArtwork ? 0xff6600 : 0x00ff00); // Orange for artworks, green for regular points
      p.material.opacity = 0.7;
    }
  });
  
  // Hide any existing overlays during movement
  hidePointInfo();
  hideArtworkOverlay();
  
  // Move camera to the point
  gsap.to(camera.position, {
    x: point.position.x,
    y: point.position.y,
    z: point.position.z,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => {
      // During transition, look at the target
      camera.lookAt(point.userData.lookAt);
    },
    onComplete: () => {
      // Update controls target
      controls.target.copy(point.userData.lookAt);
      controls.update();
      
      // Only show info after camera movement is complete
      showPointInfo(point.userData.name, point.userData.info);
    }
  });
}

// Function to return to saved position
function returnToSavedPosition() {
  if (!isZoomedIn) return;
  
  isZoomedIn = false;
  currentPointIndex = -1;
  
  // Reset all point colors
  zoomPoints.forEach(p => {
    p.material.color.set(p.userData.isArtwork ? 0xff6600 : 0x00ff00); // Orange for artworks, green for regular points
    p.material.opacity = 0.7;
  });
  
  // Hide info and artwork overlay
  hidePointInfo();
  hideArtworkOverlay();
  
  // Store initial camera position and target for interpolation
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  
  // Calculate a direction vector from current position to saved position
  const moveDirection = new THREE.Vector3().subVectors(savedCameraPos, camera.position).normalize();
  
  // Create a temporary lookAt point in the direction of movement
  const tempLookAt = new THREE.Vector3().addVectors(
    camera.position,
    moveDirection.multiplyScalar(2)
  );
  
  // First, smoothly rotate to face the direction of movement
  gsap.to(controls.target, {
    x: tempLookAt.x,
    y: tempLookAt.y,
    z: tempLookAt.z,
    duration: 0.5,
    ease: "power1.inOut",
    onUpdate: () => {
      // Keep camera position fixed during initial rotation
      controls.update();
    },
    onComplete: () => {
      // Create a progress variable for the transition
      let transitionProgress = { value: 0 };
      
      // Then, move to the saved position while gradually changing lookAt
      gsap.to(transitionProgress, {
        value: 1,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          // Interpolate camera position
          camera.position.lerpVectors(startPosition, savedCameraPos, transitionProgress.value);
          
          // Interpolate lookAt point
          const currentLookAt = new THREE.Vector3().lerpVectors(tempLookAt, savedTarget, transitionProgress.value);
          controls.target.copy(currentLookAt);
          controls.update();
        },
        onComplete: () => {
          // Finally, set the exact saved position and target
          camera.position.copy(savedCameraPos);
          controls.target.copy(savedTarget);
          controls.update();
        }
      });
    }
  });
}

// Function to show point info
function showPointInfo(name, info = "") {
  let infoElement = document.getElementById("point-info");
  if (!infoElement) {
    infoElement = document.createElement("div");
    infoElement.id = "point-info";
    infoElement.style.position = "absolute";
    infoElement.style.bottom = "30px";
    infoElement.style.left = "50%";
    infoElement.style.transform = "translateX(-50%)";
    infoElement.style.backgroundColor = "rgba(0,0,0,0.7)";
    infoElement.style.color = "white";
    infoElement.style.padding = "15px 25px";
    infoElement.style.borderRadius = "10px";
    infoElement.style.zIndex = "200";
    infoElement.style.fontFamily = "Arial, sans-serif";
    
    document.body.appendChild(infoElement);
  }
  
  // Add navigation buttons with mobile-friendly styling
  const navigationButtons = `
    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
      <button id="prev-point" style="
        padding: 10px 20px; 
        background: #3333ff; 
        border: none; 
        color: white; 
        border-radius: 8px; 
        cursor: pointer;
        font-size: 16px;
        min-width: 120px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      ">
        <span style="font-size: 1.4rem;">←</span> Vorige
      </button>
      <button id="next-point" style="
        padding: 10px 20px; 
        background: #3333ff; 
        border: none; 
        color: white; 
        border-radius: 8px; 
        cursor: pointer;
        font-size: 16px;
        min-width: 120px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      ">
        Volgende <span style="font-size: 1.4rem;">→</span>
      </button>
    </div>
  `;
  
  // Create a toggle button for the description
  const descriptionToggle = info ? `
    <div style="margin:5px 0;">
      <button id="toggle-description" style="
        background: none;
        border: none;
        color: #00ff88;
        font-size: 0.9rem;
        padding: 5px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-family: Arial, sans-serif;
        -webkit-tap-highlight-color: transparent;
      ">
        <span id="toggle-icon" style="
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 18px;
          text-align: center;
          border-radius: 50%;
          border: 1px solid #00ff88;
          margin-right: 8px;
        ">+</span>
        Lees meer
      </button>
      <div id="description-content" style="
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        margin-top: 0;
        padding: 0 10px;
        border-left: 2px solid #00ff88;
        font-size: 0.9rem;
      ">${info}</div>
    </div>
  ` : '';

  infoElement.innerHTML = `
    <h3 style="margin:0 0 10px 0;font-size:1.4rem;color:#00ff88">${name}</h3>
    ${descriptionToggle}
    <p style="margin:10px 0 0 0;font-size:0.8rem;opacity:0.6">Klik ergens anders om naar een ander punt te gaan of terug te keren</p>
    ${currentPointIndex >= 0 ? navigationButtons : ''}
  `;
  
  // Add event listener for the toggle button
  if (info) {
    setTimeout(() => {
      const toggleBtn = document.getElementById('toggle-description');
      const descContent = document.getElementById('description-content');
      const toggleIcon = document.getElementById('toggle-icon');
      
      if (toggleBtn && descContent && toggleIcon) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent click from bubbling up
          
          if (descContent.style.maxHeight === '0px' || !descContent.style.maxHeight) {
            descContent.style.maxHeight = '300px'; // Expand
            descContent.style.marginTop = '10px';
            descContent.style.paddingBottom = '10px';
            toggleIcon.innerHTML = '−'; // Minus sign
          } else {
            descContent.style.maxHeight = '0px'; // Collapse
            descContent.style.marginTop = '0';
            descContent.style.paddingBottom = '0';
            toggleIcon.innerHTML = '+'; // Plus sign
          }
        });
      }
    }, 100); // Small delay to ensure DOM is ready
  }
  
  infoElement.style.display = "block";
  
  // Add event listeners to navigation buttons
  if (currentPointIndex >= 0) {
    document.getElementById("prev-point").addEventListener("click", navigateToPreviousPoint);
    document.getElementById("next-point").addEventListener("click", navigateToNextPoint);
  }
  
  // Show artwork overlay if this is an artwork point
  if (currentPointIndex >= 0 && zoomPoints[currentPointIndex].userData.isArtwork) {
    console.log('Showing artwork overlay for:', name);
    console.log('Is artwork:', zoomPoints[currentPointIndex].userData.isArtwork);
    showArtworkOverlay(name);
  } else {
    console.log('Hiding artwork overlay, not an artwork point');
    hideArtworkOverlay();
  }
}

// Function to navigate to the previous point
function navigateToPreviousPoint(event) {
  event.stopPropagation(); // Prevent the click from bubbling up
  
  if (zoomPoints.length <= 1 || currentPointIndex < 0) return;
  
  // Hide artwork overlay before navigation
  hideArtworkOverlay();
  hidePointInfo();
  
  // Find the previous point index
  const prevIndex = (currentPointIndex - 1 + zoomPoints.length) % zoomPoints.length;
  
  // Move to the previous point
  moveToZoomPoint(zoomPoints[prevIndex]);
}

// Function to navigate to the next point
function navigateToNextPoint(event) {
  event.stopPropagation(); // Prevent the click from bubbling up
  
  if (zoomPoints.length <= 1 || currentPointIndex < 0) return;
  
  // Hide artwork overlay before navigation
  hideArtworkOverlay();
  hidePointInfo();
  
  // Find the next point index
  const nextIndex = (currentPointIndex + 1) % zoomPoints.length;
  
  // Move to the next point
  moveToZoomPoint(zoomPoints[nextIndex]);
}

// Function to show artwork overlay
function showArtworkOverlay(artworkName) {
  console.log('showArtworkOverlay called for:', artworkName);
  
  // Get the appropriate image configuration based on the artwork name
  const imageConfig = getImageForArtwork(artworkName);
  
  // If no image config is returned (e.g., for "Aan Tafel"), don't show overlay
  if (!imageConfig) {
    console.log('No image to display for:', artworkName);
    hideArtworkOverlay();
    return;
  }
  
  let overlayElement = document.getElementById("artwork-overlay");
  if (!overlayElement) {
    console.log('Creating new overlay element');
    overlayElement = document.createElement("div");
    overlayElement.id = "artwork-overlay";
    overlayElement.style.position = "fixed";
    overlayElement.style.top = "0";
    overlayElement.style.left = "0";
    overlayElement.style.width = "100%";
    overlayElement.style.height = "100%";
    overlayElement.style.display = "flex";
    overlayElement.style.justifyContent = "center";
    overlayElement.style.alignItems = "center";
    overlayElement.style.pointerEvents = "none"; // Allow clicks to pass through
    overlayElement.style.zIndex = "150"; // Below the info panel but above the scene
    
    document.body.appendChild(overlayElement);
  }
  
  // Extract image properties from config
  const { path, width, height, offsetX = "0px", offsetY = "0px" } = imageConfig;
  
  // Compose transform with optional offsets
  const transformStyles = `translate(${offsetX}, ${offsetY}) perspective(1000px) rotateY(5deg)`;
  
  // Create a frame effect with the image
  overlayElement.innerHTML = `
    <div style="
      position: relative;
      width: ${width};
      height: ${height};
      padding: 0;
      box-shadow: 0 0 30px rgba(0,0,0,0.8);
      overflow: hidden;
      transform: ${transformStyles};
    ">
      <div style="
        height: 100%;
        width: 100%;
      ">
        <img src="${path}" style="
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        "
        onload="console.log('Image loaded successfully:', '${path}')"
        onerror="console.error('Error loading image:', '${path}')">
      </div>
    </div>
  `;
  
  overlayElement.style.display = "flex";
}

// Function to hide artwork overlay
function hideArtworkOverlay() {
  const overlayElement = document.getElementById("artwork-overlay");
  if (overlayElement) {
    overlayElement.style.display = "none";
  }
}

// Function to get the appropriate image for an artwork
function getImageForArtwork(artworkName) {
  console.log('Getting image for artwork:', artworkName);
  
  // Special case for "Aan Tafel" - no image
  if (artworkName === "Aan Tafel") {
    console.log('Aan Tafel should not have an image');
    return null;
  }
  
  // Map artwork names to image configurations
  const artworkConfigs = {
    "Colosseum": {
      path: "img/collo.JPG",
      width: "600px",
      height: "860px",
      offsetX: "30px",
      offsetY: "-50px"
    },
    "Greeting to the Sea": {
      path: "img/sea.JPG",
      width: "540px",
      height: "720px",
      offsetX: "32px",
      offsetY: "14px"
    },
    "Fotografie": {
      path: "img/fotografie.JPG",
      width: "750px",
      height: "960px",
      offsetX: "-38px"
    },
    "The Birth of Venus": {
      path: "img/birthofvenus.JPG",
      width: "560px",
      height: "717px",
      offsetX: "-14px",
      offsetY: "14px"
    },
    "Film": {
      path: "img/film.JPG",
      width: "630px",
      height: "723px",
      offsetX: "-19px",
      offsetY: "23px"
    },
    "Citadella Toren": {
      path: "img/canon.JPG",
      offsetX: "-43px",
      offsetY: "-50px",
      width: "510px",
      height: "830px"
    },
    "Maria bedevaartsoord in Banneux": {
      path: "img/Maria.JPG",
      width: "590px",
      height: "480px",
      offsetX: "-40px",
      offsetY: "20px"
    },
    "Muziek": {
      path: "img/music.png",
      width: "780px",
      height: "760px",
      offsetX: "-24px",
      offsetY: "20px"
    }
  };
  
  // Default config
  const defaultConfig = {
    path: "img/canon.JPG",
    width: "500px",
    height: "400px"
  };
  
  // Return the image config or a default if not found
  const config = artworkConfigs[artworkName] || defaultConfig;
  console.log('Selected image config:', config);
  return config;
}

// Function to hide point info
function hidePointInfo() {
  const infoElement = document.getElementById("point-info");
  if (infoElement) {
    infoElement.style.display = "none";
  }
}

// Function to create instruction box
function createInstructionBox() {
  const instructionBox = document.createElement("div");
  instructionBox.id = "instruction-box";
  instructionBox.style.position = "fixed";
  instructionBox.style.bottom = "20px";
  instructionBox.style.right = "20px";
  instructionBox.style.backgroundColor = "rgba(0,0,0,0.8)";
  instructionBox.style.color = "white";
  instructionBox.style.padding = "12px 18px";
  instructionBox.style.borderRadius = "8px";
  instructionBox.style.fontFamily = "Arial, sans-serif";
  instructionBox.style.fontSize = "16px";
  instructionBox.style.zIndex = "100";
  instructionBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.6)";
  instructionBox.style.borderLeft = "4px solid #ff6600";
  instructionBox.style.maxWidth = "90%";
  instructionBox.style.width = "auto";
  instructionBox.style.textAlign = "center";
  
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Add orange circle icon and text
  instructionBox.innerHTML = `
    <div style="display: flex; align-items: center;">
      <div style="
        width: 16px;
        height: 16px;
        background-color: #ff6600;
        border-radius: 50%;
        margin-right: 10px;
        flex-shrink: 0;
      "></div>
      <span>${isMobile ? "Tap" : "Click"} on the orange circles to view images</span>
    </div>
  `;
  
  document.body.appendChild(instructionBox);
  
  // Add fade-out effect after 10 seconds
  setTimeout(() => {
    const fadeEffect = setInterval(() => {
      if (!instructionBox.style.opacity) {
        instructionBox.style.opacity = "1";
      }
      if (instructionBox.style.opacity > "0") {
        instructionBox.style.opacity -= "0.1";
      } else {
        clearInterval(fadeEffect);
        instructionBox.style.display = "none";
      }
    }, 100);
  }, 10000);
}

// Track mouse movement for hover effects
container.addEventListener('mousemove', (event) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  // Update cursor style when hovering over zoom points
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(zoomPoints);
  
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
});

// Add keyboard event listener for position logging and artwork creation
window.addEventListener('keydown', (event) => {
  // Press 'P' key to log position
  if (event.key === 'p' || event.key === 'P') {
    logCameraPosition();
  }
  
  // Press 'C' key to copy position as zoom point data
  if (event.key === 'c' || event.key === 'C') {
    const position = camera.position.clone();
    const lookAt = controls.target.clone();
    
    const zoomPointData = `{
  position: new THREE.Vector3(${position.x.toFixed(3)}, ${position.y.toFixed(3)}, ${position.z.toFixed(3)}),
  lookAt: new THREE.Vector3(${lookAt.x.toFixed(3)}, ${lookAt.y.toFixed(3)}, ${lookAt.z.toFixed(3)}),
  name: "Artwork View",
  info: "View of the artwork"
},`;
    
    console.log("Copy this zoom point data:");
    console.log(zoomPointData);
  }
  
  // Press 'A' key to add a new artwork zoom point at current position
  if (event.key === 'a' || event.key === 'A') {
    const artworkName = prompt("Enter artwork name:");
    if (artworkName) {
      const artworkInfo = prompt("Enter artwork description:");
      addArtworkZoomPoint(artworkName, artworkInfo || "");
    }
  }
  
  // Press 'R' key to start 360-degree rotation
  if (event.key === 'r' || event.key === 'R') {
    startRotation();
  }
  
  // Press 'S' key to stop 360-degree rotation
  if (event.key === 's' || event.key === 'S') {
    stopRotation();
  }
  
  // Rotation control keys
  if (isRotating) {
    // Press '+' key to increase rotation speed
    if (event.key === '+' || event.key === '=') {
      adjustRotationSpeed(0.005);
    }
    
    // Press '-' key to decrease rotation speed
    if (event.key === '-' || event.key === '_') {
      adjustRotationSpeed(-0.005);
    }
    
    // Press 'ArrowUp' to increase camera height
    if (event.key === 'ArrowUp') {
      camera.position.y += 0.1;
    }
    
    // Press 'ArrowDown' to decrease camera height
    if (event.key === 'ArrowDown') {
      camera.position.y -= 0.1;
    }
    
    // Press 'ArrowRight' to increase rotation radius
    if (event.key === 'ArrowRight') {
      rotationRadius += 0.1;
    }
    
    // Press 'ArrowLeft' to decrease rotation radius
    if (event.key === 'ArrowLeft') {
      rotationRadius = Math.max(0.5, rotationRadius - 0.1);
    }
  }
});

// Function to adjust rotation speed
function adjustRotationSpeed(amount) {
  rotationSpeed += amount;
  console.log("Rotation speed:", rotationSpeed);
}

// Resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateRotation();
  renderer.render(scene, camera);
}
animate();
