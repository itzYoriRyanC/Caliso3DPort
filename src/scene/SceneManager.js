import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Loader } from "./Loader.js";

export class SceneManager {
  constructor(canvas, onItemClicked) {
    this.canvas = canvas;
    this.onItemClicked = onItemClicked; // Callback function linked to main.js
    this.sizes = { width: window.innerWidth, height: window.innerHeight };

    this.scene = new THREE.Scene();
    
    // 🌙 Dark Cinematic Background Color
    this.scene.background = new THREE.Color(0x121214);

    this.clock = new THREE.Clock();
    this.loader = new Loader();
    
    this.deskModel = null;
    this.targetLook = new THREE.Vector3(0, 0, 0);
    
    // 🎯 Parallax anchor point tracking
    this.baseTarget = new THREE.Vector3(0, 0, 0); 

    // Raycasting & Mouse Interaction Setup
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0); // Defaults to center (0,0)
    this.interactiveObjects = [];
    
    // 🛰️ Trackers for Hardware-Accelerated Text Sprites and Pulse Waves
    this.hints = [];
    this.sprites = [];

    this.setCamera();
    this.setRenderer();
    this.setControls();
    this.setLights();    
    this.setResize();
    this.setClickInteraction(); // Monitors clicks on the 3D model

    this.loadDeskModel();
    this.tick();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.camera.position.set(10, 8, 14);
    this.scene.add(this.camera);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0; 
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;   
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;       
    this.controls.minDistance = 3.5;       
    this.controls.maxDistance = 18;        
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevents camera going below floor
  }

  setLights() {
    // 1. 🖼️ Ambient Fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    // 2. ☀️ Cinematic Key Light (Directional Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 12, 8); 
    keyLight.castShadow = true;

    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    
    const d = 8;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005; 

    this.scene.add(keyLight);

    // 3. 🟠 Warm Desk Lamp Glow
    const warmDeskLight = new THREE.PointLight(0xff923c, 12.0, 7);
    warmDeskLight.position.set(-0.5, 1.4, 0.8); 
    this.scene.add(warmDeskLight);

    // 4. 🩵 Cyberpunk Neon Background Rim
    const neonGlow = new THREE.PointLight(0x00ffff, 8.0, 10);
    neonGlow.position.set(2, 2.5, -3.5); 
    this.scene.add(neonGlow);
  }

  async loadDeskModel() {
    // 🔍 AUTOMATIC PATH FINDER: Robust asset loading target tracking
    const pathsToTry = [
      "/src/assets/DeskRoomRyan.glb",
      "/DeskRoomRyan.glb",
      "/deskroomryan.glb",
      "/src/assets/DeskRoomFinal.glb",
      "/DeskRoomFinal.glb"
    ];

    let gltf = null;

    for (const path of pathsToTry) {
      try {
        gltf = await this.loader.loadModel(path);
        console.log(`✅ Successfully loaded master 3D room from: ${path}`);
        break; 
      } catch (err) {
        // Silently fall back to next pattern path variation
      }
    }

    if (!gltf) {
      console.error("❌ Could not find your DeskRoomRyan.glb file anywhere in the project folders.");
      return;
    }

    const spawnedHints = new Set();

    this.deskModel = gltf.scene;
    this.deskModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        this.interactiveObjects.push(child); 
        
        // Trace upward through parents to match target groups renamed in Blender
        let obj = child;
        let targetKey = "";
        let finalTargetGroup = child; 

        while (obj) {
          const name = obj.name ? obj.name.toLowerCase() : "";
          if (name.includes("desk_paper"))     { targetKey = "desk_paper"; finalTargetGroup = obj; break; }
          if (name.includes("coffee"))         { targetKey = "coffee"; finalTargetGroup = obj; break; }
          if (name.includes("notebook"))       { targetKey = "notebook"; finalTargetGroup = obj; break; }
          if (name.includes("monitor_image"))   { targetKey = "monitor_image"; finalTargetGroup = obj; break; }
          if (name.includes("monitor2"))       { targetKey = "monitor2"; finalTargetGroup = obj; break; }
          if (name.includes("blackbox"))       { targetKey = "blackbox"; finalTargetGroup = obj; break; }
          if (name.includes("mousepad"))       { targetKey = "mousepad"; finalTargetGroup = obj; break; }
          if (name.includes("staticroom.543")) { targetKey = "box_fallback"; finalTargetGroup = obj; break; }
          if (name.includes("staticroom.876")) { targetKey = "keyboard_fallback"; finalTargetGroup = obj; break; }
          obj = obj.parent;
        }

        // Generate combined bold text caps and pulse rings over targets
        if (targetKey && !spawnedHints.has(targetKey)) {
          this.addSuperBoldTextAndCircleHint(finalTargetGroup); 
          spawnedHints.add(targetKey);
        }
      }
    });

    this.deskModel.scale.set(1, 1, 1);
    this.deskModel.position.set(0, -1, 0); 

    this.scene.add(this.deskModel);
    this.fitCameraToObject(this.deskModel);
  }

  // 🛠️ 🛰️ HIGH-VISIBILITY COMBINED TEXT CAPSULE & RADAR RING GENERATOR
  addSuperBoldTextAndCircleHint(mesh) {
    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    const name = mesh.name.toLowerCase();

    const isMainMonitor = name.includes("monitor_image");
    const textString = isMainMonitor ? "HERE" : "DATA";
    const baseColorHex = isMainMonitor ? "#00ffff" : "#00ffaa"; // Neon Cyan vs Bright Emerald Neon

    // --- 1. SUPER BOLD BILLBOARD TEXT SPRITE ---
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 140;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 320, 140);

    // Render high-tech capsule border backfill container
    ctx.fillStyle = "rgba(18, 18, 20, 0.85)";
    ctx.strokeStyle = baseColorHex;
    ctx.lineWidth = 6;
    this.drawRoundedRect(ctx, 10, 10, 300, 120, 25);
    ctx.fill();
    ctx.stroke();

    // Render Ultra-Thick Text Labels
    ctx.font = "900 52px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text outer stroke for visibility popping
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;
    ctx.strokeText(textString, 160, 70);

    // Fill primary neon text value foreground
    ctx.fillStyle = "#ffffff";
    ctx.fillText(textString, 160, 70);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const textSprite = new THREE.Sprite(spriteMaterial);
    
    // Scale HUD item uniformly
    textSprite.scale.set(0.65, 0.28, 1);
    textSprite.position.copy(center);
    textSprite.position.y = box.max.y + 0.42; // Elevated floating layout

    textSprite.userData = { bobPhase: Math.random() * Math.PI * 2 };
    this.scene.add(textSprite);
    this.sprites.push(textSprite);

    // --- 2. BOLD EXPANDING RADAR CIRCLE RING ANIMATION ---
    const ringGeo = new THREE.RingGeometry(0.01, 0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(baseColorHex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    const hintRing = new THREE.Mesh(ringGeo, ringMat);
    hintRing.position.copy(center);

    if (name.includes("monitor") || name.includes("screen") || name.includes("display")) {
      hintRing.position.z += 0.08;
    } else {
      hintRing.rotation.x = -Math.PI / 2;
      hintRing.position.y = box.max.y + 0.015; 
    }

    hintRing.userData = { progress: Math.random() };
    this.scene.add(hintRing);
    this.hints.push(hintRing);
  }

  // Canvas utility helper mapping rounded bounding capsule containers
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 210); // Tweaked ratio bounding bounds
    let distance = maxDim / (2 * Math.tan(fov / 2));
    
    distance *= 1.75; 

    this.targetLook.copy(center);
    this.baseTarget.copy(center); 
    this.controls.target.copy(center);

    this.targetCameraPosition = new THREE.Vector3(
      center.x + distance * 0.6,
      center.y + distance * 0.9,
      center.z + distance * 0.7
    );
  }

  setClickInteraction() {
    const ringCursor = document.querySelector(".custom-cursor-ring");
    const dotCursor = document.querySelector(".custom-cursor-dot");

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (ringCursor && dotCursor) {
        ringCursor.style.left = `${event.clientX}px`;
        ringCursor.style.top = `${event.clientY}px`;
        dotCursor.style.left = `${event.clientX}px`;
        dotCursor.style.top = `${event.clientY}px`;
      }

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      let hoveringInteractive = false;

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj) {
          const name = obj.name ? obj.name.toLowerCase() : "";
          if (this.isInteractivePart(name)) {
            hoveringInteractive = true;
            break;
          }
          obj = obj.parent;
        }
      }

      if (hoveringInteractive && ringCursor && dotCursor) {
        ringCursor.classList.add("hovering");
        dotCursor.classList.add("hovering");
      } else if (ringCursor && dotCursor) {
        ringCursor.classList.remove("hovering");
        dotCursor.classList.remove("hovering");
      }
    });

    window.addEventListener("click", () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        let matchedName = "";

        while (obj) {
          const name = obj.name ? obj.name.toLowerCase() : "";
          if (this.isInteractivePart(name)) {
            matchedName = name;
            break; 
          }
          obj = obj.parent;
        }

        if (matchedName) {
          this.onItemClicked(matchedName);
        } else {
          this.onItemClicked(intersects[0].object.name.toLowerCase());
        }
      }
    });
  }

  // 🛠️ VALIDATED EXTENSION INTERACTIVE ROUTING MAP
  isInteractivePart(name) {
    if (!name) return false;
    return (
      name.includes("desk_paper")     || 
      name.includes("monitor_image")  || 
      name.includes("coffee")         || 
      name.includes("notebook")       ||
      name.includes("monitor2")       || 
      name.includes("blackbox")       || 
      name.includes("mousepad")       || 
      name.includes("staticroom.543") || 
      name.includes("staticroom.549") || 
      name.includes("staticroom.552") ||
      name.includes("staticroom.876") || // 🚀 FIX: Added missing keyboard mapping to interaction engine
      name.includes("monitor")        || 
      name.includes("screen")         || 
      name.includes("display")
    );
  }

  setResize() {
    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  tick() {
    const elapsed = this.clock.getElapsedTime();

    if (this.targetCameraPosition) {
      this.camera.position.lerp(this.targetCameraPosition, 0.05);
      if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.01) {
        this.targetCameraPosition = null; 
      }
    }

    if (this.controls && this.baseTarget) {
      const intensity = 1.0; 
      const targetX = this.baseTarget.x + (this.mouse.x * intensity);
      const targetY = this.baseTarget.y + (this.mouse.y * intensity);

      this.controls.target.x += (targetX - this.controls.target.x) * 0.05;
      this.controls.target.y += (targetY - this.controls.target.y) * 0.05;
      this.controls.update();
    }

    if (this.deskModel) {
      this.deskModel.position.y = -1.0 + Math.sin(elapsed * 0.6) * 0.02;
    }

    // 🚀 ANIMATE BOLD TEXT SPRITES (Sleek levitating wave loop animation)
    this.sprites.forEach((sprite) => {
      sprite.position.y += Math.sin(elapsed * 3.0 + sprite.userData.bobPhase) * 0.0012;
    });

    // 🚀 ANIMATE MULTI-STAGE RADAR CIRCLE RINGS
    this.hints.forEach((hint) => {
      hint.userData.progress += 0.015; // Animation expansion velocity frequency
      if (hint.userData.progress > 1) {
        hint.userData.progress = 0; // Infinite loop resets
      }

      // Expands size from factor 1 up to a bold 4.2x area reach ring footprint
      const targetScale = 1 + hint.userData.progress * 3.2;
      hint.scale.set(targetScale, targetScale, 1);
      
      // Gradually drop transparency matching outer boundaries decay
      hint.material.opacity = (1 - hint.userData.progress) * 0.9;
    });

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.tick());
  }
}