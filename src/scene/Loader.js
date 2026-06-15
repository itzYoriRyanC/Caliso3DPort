import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class Loader {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    this.gltfLoader.setDRACOLoader(dracoLoader);

    // Dynamic cinematic phases to show during scene construction
    this.loadingPhases = [
      { max: 25, text: "Analyzing Room Blueprints..." },
      { max: 55, text: "Assembling Workstation Geometry..." },
      { max: 80, text: "Wiring Lights & Neon Gradients..." },
      { max: 99, text: "Baking Soft Shadow Mapping..." },
      { max: 100, text: "Environment Ready." }
    ];

    this.loadingManager.onProgress = (url, loaded, total) => {
      const percent = Math.round((loaded / total) * 100);
      
      // 1. Update the progress bar width smoothly
      const bar = document.querySelector(".loader-bar");
      if (bar) bar.style.width = `${percent}%`;

      // 2. Morph text labels based on the active structural phase
      const textElement = document.querySelector(".loader-text");
      if (textElement) {
        const currentPhase = this.loadingPhases.find(phase => percent <= phase.max);
        if (currentPhase) {
          textElement.innerHTML = `${currentPhase.text} <span style="color: var(--accent); font-weight:700;">${percent}%</span>`;
        }
      }
    };

    this.loadingManager.onLoad = () => {
      const overlay = document.querySelector(".loader-overlay");
      if (overlay) {
        // Smoothly animate the overlay out with styling scale-up drops
        overlay.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s ease";
        overlay.style.transform = "scale(1.05)";
        overlay.classList.add("hidden");
        
        setTimeout(() => overlay.remove(), 800);
      }
    };
  }

  loadModel(path) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(gltf),
        undefined,
        (error) => reject(error)
      );
    });
  }
}