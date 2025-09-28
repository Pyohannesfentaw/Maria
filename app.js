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

// Function to create zoom points
function createZoomPoints(center, size) {
  // Define zoom point positions and information
  const pointsData = [
    {
      position: new THREE.Vector3(1.006, 1.336, -0.114),
      lookAt: new THREE.Vector3(0.407, 1.385, -0.055),
      name: "Aan Tafel",
      info: "rotate and click on the green points to have a better view",
      isArtwork: true
    },
    {
        position: new THREE.Vector3(2.724, 2.062, 0.846),
        lookAt: new THREE.Vector3(7.770, 2.359, -1.409),
        name: "Artwork1 View",
        info: "View of the artwork",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(3.006, 3.334, 0.484),
        lookAt: new THREE.Vector3(7.967, 3.131, -1.247),
        name: "Artwork2 View",
        info: "View of the artwork",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.356, 2.501, -0.712),
        lookAt: new THREE.Vector3(-3.259, 2.551, -2.794),
        name: "Artwork4 View",
        info: "View of the artwork",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.508, 2.264, 2.289),
        lookAt: new THREE.Vector3(-2.265, 2.312, 2.584),
        name: "Artwork5 View",
        info: "View of the artwork on north wall",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.785, 3.486, 2.401),
        lookAt: new THREE.Vector3(-2.195, 3.490, 2.559),
        name: "Artwork6 View",
        info: "View of the artwork on north wall",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.876, 3.409, -0.695),
        lookAt: new THREE.Vector3(-3.353, 3.419, -0.508),
        name: "Artwork7 View",
        info: "View of the artwork on north wall",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(1.186, 2.882, -1.236),
        lookAt: new THREE.Vector3(1.286, 2.882, -1.426),
        name: "Artwork8 View",
        info: "View of the artwork on north wall",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(0.734, 2.728, -2.264),
        lookAt: new THREE.Vector3(0.670, 2.727, -2.410),
        name: "Artwork9 View",
        info: "View of the artwork",
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

// Handle click
container.addEventListener('click', (event) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

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
  
  // Add navigation buttons
  const navigationButtons = `
    <div style="display: flex; justify-content: space-between; margin-top: 15px;">
      <button id="prev-point" style="padding: 5px 15px; background: #3333ff; border: none; color: white; border-radius: 5px; cursor: pointer;">
        <span style="font-size: 1.2rem;">←</span> Previous
      </button>
      <button id="next-point" style="padding: 5px 15px; background: #3333ff; border: none; color: white; border-radius: 5px; cursor: pointer;">
        Next <span style="font-size: 1.2rem;">→</span>
      </button>
    </div>
  `;
  
  infoElement.innerHTML = `
    <h3 style="margin:0 0 10px 0;font-size:1.4rem;color:#00ff88">${name}</h3>
    ${info ? `<p style="margin:0;font-size:0.9rem">${info}</p>` : ''}
    <p style="margin:10px 0 0 0;font-size:0.8rem;opacity:0.6">Click elsewhere to move to another point or return</p>
    ${currentPointIndex >= 0 ? navigationButtons : ''}
  `;
  
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
    "Artwork1 View": {
      path: "img/Artwork1.JPG",
      width: "600px",
      height: "570px",
      offsetX: "-60px",
      offsetY: "-50px"
    },
    "Artwork2 View": {
      path: "img/Artwork2.JPG",
      width: "540px",
      height: "720px",
      offsetX: "32px",
      offsetY: "14px"
    },
    "Artwork4 View": {
      path: "img/Artwork4.JPG",
      width: "750px",
      height: "960px",
      offsetX: "-38px"
    },
    "Artwork5 View": {
      path: "img/Artwork5.JPG",
      width: "560px",
      height: "717px",
      offsetX: "-14px",
      offsetY: "14px"
    },
    "Artwork6 View": {
      path: "img/Artwork6.JPG",
      width: "630px",
      height: "723px",
      offsetX: "-19px",
      offsetY: "23px"
    },
    "Artwork7 View": {
      path: "img/Artwork7.JPG",
      offsetX: "-43px",
      offsetY: "37px",
      width: "510px",
      height: "630px"
    },
    "Artwork8 View": {
      path: "img/Artwork8.JPG",
      width: "590px",
      height: "480px",
      offsetX: "-40px",
      offsetY: "20px"
    },
    "Artwork9 View": {
      path: "img/Artwork9.JPG",
      width: "580px",
      height: "660px",
      offsetX: "14px",
      offsetY: "-20px"
    }
  };
  
  // Default config
  const defaultConfig = {
    path: "img/Artwork1.JPG",
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
  instructionBox.style.backgroundColor = "rgba(0,0,0,0.7)";
  instructionBox.style.color = "white";
  instructionBox.style.padding = "10px 15px";
  instructionBox.style.borderRadius = "5px";
  instructionBox.style.fontFamily = "Arial, sans-serif";
  instructionBox.style.fontSize = "14px";
  instructionBox.style.zIndex = "100";
  instructionBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  instructionBox.style.borderLeft = "3px solid #ff6600";
  
  // Add orange circle icon and text
  instructionBox.innerHTML = `
    <div style="display: flex; align-items: center;">
      <div style="
        width: 12px;
        height: 12px;
        background-color: #ff6600;
        border-radius: 50%;
        margin-right: 8px;
      "></div>
      <span>Click on the orange circles to view images</span>
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
