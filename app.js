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
      info: "Welcome to the virtual art gallery! This central viewing point offers a perfect starting place to explore the collection. Look around to discover the orange markers that indicate artworks throughout the space. Click on these markers to view each piece up close and learn about its story. Use the navigation buttons to move between artworks or click elsewhere to return to your previous position.",
      isArtwork: true
    },
    {
        position: new THREE.Vector3(2.724, 2.062, 0.846),
        lookAt: new THREE.Vector3(7.770, 2.359, -1.409),
        name: "Artwork1 View",
        info: "This piece was inspired by the interplay of light and shadow in Amsterdam's canal houses. Created during a particularly rainy autumn, it captures the warm glow that emerges from within the darkness. The artist used a unique layering technique to achieve the depth and luminosity that characterizes this work.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(3.006, 3.334, 0.484),
        lookAt: new THREE.Vector3(7.967, 3.131, -1.247),
        name: "Artwork2 View",
        info: "This artwork is a reflection on the relationship between nature and architecture. The artist explores the tension between the organic forms of the natural world and the geometric structures of human creation. The result is a captivating blend of textures and colors that invites the viewer to contemplate the intersection of these two realms.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.356, 2.501, -0.712),
        lookAt: new THREE.Vector3(-3.259, 2.551, -2.794),
        name: "Artwork4 View",
        info: "This striking piece represents the artist's exploration of memory and identity. Inspired by childhood recollections of summer afternoons, the vibrant colors and bold brushstrokes create a sense of nostalgia while simultaneously challenging our perception of remembered spaces. The painting took over six months to complete as layers were continuously added and refined.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.508, 2.264, 2.289),
        lookAt: new THREE.Vector3(-2.265, 2.312, 2.584),
        name: "Artwork5 View",
        info: "This contemplative work explores themes of solitude and inner peace. Created during the artist's retreat in the mountains, it captures the serene quality of morning light as it filters through mist. The subtle color palette and delicate brushwork invite viewers to pause and reflect on moments of quiet beauty in their own lives. The piece won critical acclaim when first exhibited in 2023.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-1.785, 3.486, 2.401),
        lookAt: new THREE.Vector3(-2.195, 3.490, 2.559),
        name: "Artwork6 View",
        info: "This dynamic composition challenges conventional notions of perspective and space. The artist, influenced by both cubism and digital art, created this piece using an innovative mixed-media approach. Layers of paint interact with collage elements to create a sense of depth that shifts as the viewer moves around the work. The title references the artist's fascination with quantum physics and multiple realities.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(-2.876, 3.409, -0.695),
        lookAt: new THREE.Vector3(-3.353, 3.419, -0.508),
        name: "Artwork7 View",
        info: "This evocative piece is part of the artist's acclaimed 'Urban Fragments' series. It captures the essence of city life through abstracted architectural forms and vibrant color fields. Created over a period of two years, the work evolved as the artist moved between different neighborhoods, absorbing the unique energy and character of each place. The textural elements were achieved using a combination of traditional painting techniques and experimental materials.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(1.186, 2.882, -1.236),
        lookAt: new THREE.Vector3(1.286, 2.882, -1.426),
        name: "Artwork8 View",
        info: "This meditative landscape draws inspiration from the artist's childhood memories of the Dutch countryside. The horizontal composition creates a sense of expansiveness while the carefully balanced color palette evokes the distinctive quality of light found in Northern European skies. Though seemingly simple at first glance, closer inspection reveals intricate details and subtle variations in texture that reward prolonged viewing.",
        isArtwork: true
      },
      {
        position: new THREE.Vector3(0.734, 2.728, -2.264),
        lookAt: new THREE.Vector3(0.670, 2.727, -2.410),
        name: "Artwork9 View",
        info: "This powerful abstract work represents the culmination of the artist's exploration of color theory and emotional expression. The bold, gestural brushwork and vibrant palette create a sense of movement and energy that seems to extend beyond the canvas. Created during a particularly transformative period in the artist's life, the piece embodies themes of renewal and personal growth. It was the centerpiece of the acclaimed 'Transitions' exhibition at the Modern Art Museum.",
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
        <span style="font-size: 1.4rem;">←</span> Previous
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
        Next <span style="font-size: 1.4rem;">→</span>
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
        Show artwork story
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
    <p style="margin:10px 0 0 0;font-size:0.8rem;opacity:0.6">Click elsewhere to move to another point or return</p>
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
