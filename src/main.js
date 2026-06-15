import "./style.css";
import { SceneManager } from "./scene/SceneManager.js";
import { content } from "./data/content.js";

// 🎯 CLEAN INNER HTML INJECTION
document.querySelector("#app").innerHTML = `
  <div class="loader-overlay">
    <div class="loader-text">Initializing Terminal... <span>0%</span></div>
    <div class="loader-track">
      <div class="loader-bar"></div>
    </div>
  </div>

  <div class="custom-cursor-ring"></div>
  <div class="custom-cursor-dot"></div>

  <canvas id="experience-canvas"></canvas>

  <div id="portfolio-modal" class="modal-overlay hidden">
    <div class="modal-card" style="max-width: 800px; width: 90%; background: #121214; border: 1px solid rgba(255, 255, 255, 0.1);">
      <button id="modal-close-btn" class="modal-close" aria-label="Close modal" style="color: #ffffff; opacity: 0.7;">&times;</button>
      <div id="modal-content-area"></div>
    </div>
  </div>
`;

const modal = document.querySelector("#portfolio-modal");
const modalContent = document.querySelector("#modal-content-area");
const closeBtn = document.querySelector("#modal-close-btn");

if (closeBtn && modal) {
  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation(); 
    modal.classList.add("hidden");
    if (modalContent) modalContent.innerHTML = ""; 
  });

  modal.addEventListener("click", (event) => {
    event.stopPropagation(); 
  });
}

// 🎯 INTERACTIVE MESH EVENT BINDING
function handleMeshClick(meshName) {
  if (!meshName) return;
  
  let displayHTML = "";

  // 1. 🎯 MONOCHROME ABOUT ME WITH PREMIUM SOLID HOVER ANIMATION FIXED
  if (meshName.includes("monitor_image")) {
    displayHTML = `
      <div class="about-me-showroom" style="display: flex; flex-direction: column; gap: 1.8rem; max-height: 480px; overflow-y: auto; padding-right: 0.5rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <div style="padding-bottom: 0.2rem;">
          <h2 style="margin: 0; font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em; color: #ffffff; line-height: 1.2;">
            Developer focused on building<br/>real-world solutions
          </h2>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem; line-height: 1.75;">
          <p class="modal-text" style="color: #a1a1aa; font-size: 1.05rem; margin: 0; text-align: left; font-weight: 400;">
            ${content.about.text}
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 0.5rem; background: rgba(255, 255, 255, 0.03); padding: 1.4rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <div>
              <span style="color: #71717a; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem; letter-spacing: 0.05em;">Profile Name</span> 
              <span style="color: #ffffff; font-size: 1rem; font-weight: 500;">Ryan Andrian L. Caliso</span>
            </div>
            <div>
              <span style="color: #71717a; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem; letter-spacing: 0.05em;">Main Role</span> 
              <span style="color: #ffffff; font-size: 1rem; font-weight: 500;">Data Analyst & Developer</span>
            </div>
            <div>
              <span style="color: #71717a; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem; letter-spacing: 0.05em;">Direct Channel</span> 
              <span style="color: #ffffff; font-size: 1rem; font-weight: 500;">${content.contact.email}</span>
            </div>
            <div>
              <span style="color: #71717a; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; display: block; margin-bottom: 0.2rem; letter-spacing: 0.05em;">Location Base</span> 
              <span style="color: #ffffff; font-size: 1rem; font-weight: 500;">Philippines</span>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 0.5rem; align-items: center;">
            <a href="${content.about.cvLink}" download="Caliso_CV.pdf" class="btn-primary" 
               style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: auto; padding: 12px 28px; text-decoration: none; font-weight: 700; font-size: 0.95rem; background: #ffffff; color: #121214; border-radius: 6px; border: 1px solid #ffffff; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(0);"
               onmouseenter="this.style.background='transparent'; this.style.color='#ffffff'; this.style.transform='translateY(-2px)';"
               onmouseleave="this.style.background='#ffffff'; this.style.color='#121214'; this.style.transform='translateY(0)';">
              Download CV <span>⬇</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } 
  // 2. 🗺️ NAVIGATION MANUAL
  else if (meshName.includes("mousepad")) {
    displayHTML = `
      <h2 class="modal-title" style="color: #ffffff;">${content.navigationManual.title}</h2>
      <p class="modal-text" style="margin-top: 1rem; line-height: 1.8; white-space: pre-line; color: #a1a1aa;">
        ${content.navigationManual.guide}
      </p>
    `;
  }
  // 3. ⚡ STYLISH SIMPLIFIED TECHNICAL EXPERTISE Restored & Upgraded
  else if (
    meshName.includes("blackbox")       ||
    meshName.includes("staticroom.543") || 
    meshName.includes("staticroom.549") || 
    meshName.includes("staticroom.552")
  ) {
    displayHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2 class="modal-title" style="color: #ffffff; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.5rem;">Technical Core</h2>
        <p style="color: #71717a; font-size: 0.95rem; margin: 0 0 2rem 0;">A simplified baseline tracking verified technical capabilities and operational tool systems.</p>
        
        <div style="display: flex; flex-direction: column; gap: 1.5rem; max-height: 380px; overflow-y: auto; padding-right: 0.5rem;">
          ${content.skills.map(s => `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.05rem; font-weight: 600; color: #ffffff;">${s.name}</span>
                  <span style="font-size: 0.72rem; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em; font-weight: 700; background: rgba(255,255,255,0.03); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);">${s.category}</span>
                </div>
                <span style="font-size: 0.95rem; font-family: monospace; font-weight: 700; color: #a1a1aa;">${s.level}%</span>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.05); height: 4px; width: 100%; border-radius: 2px; overflow: hidden;">
                <div style="width: ${s.level}%; background: #ffffff; height: 100%; border-radius: 2px; box-shadow: 0 0 8px rgba(255,255,255,0.3);"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  // 4. 🌐 Social Media Section WITH SYMMETRICAL HOVER ANIMATION FIXED
  else if (
    meshName.includes("monitor2") ||
    meshName.includes("screen")   || 
    meshName.includes("monitor")  || 
    meshName.includes("display")
  ) {
    displayHTML = `
      <h2 class="modal-title" style="color: #ffffff;">Connect With Me</h2>
      <p class="modal-text" style="margin-bottom: 1.8rem; color: #a1a1aa;">Explore my workspace portals, developer repositories, and networks across the web:</p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${content.contact.socials.map(sock => `
          <a href="${sock.url}" target="_blank" rel="noopener noreferrer" 
             style="text-align: center; display: block; width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.02); color: #ffffff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.25s ease; transform: translateY(0);"
             onmouseenter="this.style.background='#ffffff'; this.style.color='#121214'; this.style.transform='translateY(-2px)';"
             onmouseleave="this.style.background='rgba(255, 255, 255, 0.02)'; this.style.color='#ffffff'; this.style.transform='translateY(0)';">
            ${sock.label}
          </a>
        `).join('')}
      </div>
    `;
  }
  // 5. ☕ Contact Direct Email WITH PREMIUM HOVER ANIMATION FIXED
  else if (meshName.includes("coffee") || meshName.includes("mug") || meshName.includes("cup")) {
    displayHTML = `
      <h2 class="modal-title" style="color: #ffffff;">Contact Me</h2>
      <p class="modal-text" style="margin-bottom: 1.5rem; color: #a1a1aa;">Let's build something beautiful together! Feel free to drop a line directly:</p>
      <a href="mailto:${content.contact.email}" 
         style="display: block; text-align: center; padding: 12px; background: #ffffff; color: #121214; text-decoration: none; font-weight: 700; border-radius: 6px; border: 1px solid #ffffff; transition: all 0.25s ease; transform: translateY(0);"
         onmouseenter="this.style.background='transparent'; this.style.color='#ffffff'; this.style.transform='translateY(-2px)';"
         onmouseleave="this.style.background='#ffffff'; this.style.color='#121214'; this.style.transform='translateY(0)';">
        Email Me Directly
      </a>
    `;
  } 
  // 6. 📂 DIRECT LIVE PREVIEW EMBED
  else if (
    meshName.includes("notebook")   || 
    meshName.includes("desk_paper") || 
    meshName.includes("paper")      || 
    meshName.includes("sheet")      || 
    meshName.includes("life")       ||
    meshName.includes("book")       || 
    meshName.includes("folder")
  ) {
    const targetProject = content.experience[0]; 
    
    displayHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <h2 class="modal-title" style="margin: 0; color: #ffffff;">${targetProject.role}</h2>
          <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 0.9rem;">${targetProject.desc}</p>
        </div>
        <a href="${targetProject.link}" target="_blank" rel="noopener noreferrer" 
           style="padding: 8px 16px; font-size: 0.85rem; width: auto; text-decoration: none; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; font-weight: 600; transition: all 0.25s ease;"
           onmouseenter="this.style.background='#ffffff'; this.style.color='#121214';"
           onmouseleave="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#fff';">
          Open External ↗
        </a>
      </div>
      
      <div style="width: 100%; height: 560px; background: #0b0b0c; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15);">
        <iframe src="${targetProject.link}" style="width: 100%; height: 100%; border: none;" allow="autoplay; encrypted-media; fullscreen" loading="lazy"></iframe>
      </div>
    `;
  }

  if (displayHTML !== "" && modal && modalContent) {
    modalContent.innerHTML = displayHTML;
    modal.classList.remove("hidden");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("#experience-canvas");
  if (canvas) {
    const sceneManager = new SceneManager(canvas, handleMeshClick);
  }
});