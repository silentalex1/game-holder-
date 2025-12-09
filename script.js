:root {
    --primary: #a855f7;
    --primary-rgb: 168, 85, 247;
    --bg: #030303;
    --surface: #0a0a0a;
    --text: #ffffff;
    --text-dim: #a1a1aa;
    --border: rgba(255, 255, 255, 0.1);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

body {
    background-color: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    transition: background-color 0.5s ease;
}

input, select {
    user-select: text;
    pointer-events: auto;
    font-family: inherit;
}

#theme-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
}

#warp-canvas, #blossom-canvas, #starwars-layer, #ocean-layer, #retro-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    display: none;
}

#ocean-layer {
    background: linear-gradient(180deg, #0f172a 0%, #1e3a8a 50%, #172554 100%);
    overflow: hidden;
}
#ocean-layer::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 40%;
    background: repeating-linear-gradient(
        90deg,
        rgba(255,255,255,0.05) 0px,
        rgba(255,255,255,0.05) 2px,
        transparent 2px,
        transparent 40px
    );
    animation: ocean-move 10s linear infinite;
    transform: perspective(500px) rotateX(60deg);
    opacity: 0.3;
}
@keyframes ocean-move { from { transform: perspective(500px) rotateX(60deg) translateX(0); } to { transform: perspective(500px) rotateX(60deg) translateX(-50%); } }

#retro-layer {
    background: linear-gradient(180deg, #2a0a18 0%, #4a042e 60%, #a21caf 100%);
    overflow: hidden;
}
#retro-layer::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 300px;
    height: 300px;
    background: linear-gradient(180deg, #facc15 0%, #ea580c 100%);
    border-radius: 50%;
    transform: translateX(-50%) translateY(30%);
    box-shadow: 0 0 100px #ea580c;
    opacity: 0.8;
}
#retro-layer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 4px, 6px 100%;
    pointer-events: none;
}

.tie-fighter {
    position: absolute;
    width: 40px;
    height: 34px;
    z-index: 0;
}
.tie-wing-l, .tie-wing-r {
    position: absolute;
    width: 8px;
    height: 100%;
    background: #94a3b8;
    border: 1px solid #475569;
    clip-path: polygon(0 10%, 100% 0, 100% 100%, 0 90%);
}
.tie-wing-r { right: 0; transform: scaleX(-1); }
.tie-center {
    position: absolute;
    left: 8px;
    top: 10px;
    width: 24px;
    height: 14px;
    background: #64748b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tie-window {
    width: 8px;
    height: 8px;
    background: #000;
    border-radius: 50%;
    border: 1px solid #333;
}

.top-controls {
    position: fixed;
    top: 40px;
    left: 40px;
    display: flex;
    gap: 15px;
    z-index: 1000;
    pointer-events: auto;
}

.navigation {
    position: fixed;
    top: 40px;
    right: 40px;
    z-index: 1000;
    pointer-events: auto;
}

.nav-link {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 24px;
    border: 1px solid var(--border);
    border-radius: 30px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    transition: all 0.3s;
}
.nav-link:hover { color: var(--text); border-color: var(--primary); box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4); }

.main-ui {
    position: relative;
    z-index: 10;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}
.main-ui > * { pointer-events: auto; }

#menu-btn, #settings-btn {
    width: 42px;
    height: 42px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text);
    transition: all 0.3s ease;
}
#menu-btn { flex-direction: column; gap: 6px; }
#menu-btn span { display: block; width: 20px; height: 2px; background: var(--text); transition: 0.3s; }
#menu-btn:hover span { background: var(--primary); width: 24px; }
#settings-btn { font-size: 20px; }
#menu-btn:hover, #settings-btn:hover { border-color: var(--primary); box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3); color: var(--primary); }

#clock-display {
    position: absolute;
    top: 20%;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: var(--text-dim);
    letter-spacing: 2px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.core-assembly {
    position: relative;
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 40px;
}

#vapor-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.input-housing {
    position: relative;
    z-index: 20;
    padding: 2px;
    background: #000;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 80px rgba(var(--primary-rgb), 0.2);
    transform: translateZ(0);
}
.input-housing::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent 20%, transparent 80%, var(--primary) 90%, transparent 100%);
    animation: border-spin 3s linear infinite;
}
@keyframes border-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

#master-input {
    position: relative;
    z-index: 2;
    width: 400px;
    padding: 20px 24px;
    background: var(--surface);
    color: var(--text);
    border: none;
    outline: none;
    text-align: center;
    font-size: 16px;
    border-radius: 14px;
    transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
#master-input:focus { width: 600px; }

.status-badge {
    margin-top: 50px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    padding: 12px 30px;
    border-radius: 100px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 320px;
}
#dynamic-text { color: var(--text); font-size: 14px; opacity: 1; transition: 0.3s; text-align: center; }
.text-cycle { opacity: 0 !important; transform: translateY(5px); }

/* Hub Interface */
#hub-layer {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(40px);
    z-index: 800;
    opacity: 0;
    visibility: hidden; 
    transition: opacity 0.3s, visibility 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
}
#hub-layer.visible { opacity: 1; visibility: visible; }
.hub-window {
    width: 90%;
    max-width: 1200px;
    height: 85%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9);
    transform: scale(0.95);
    transition: transform 0.3s;
}
#hub-layer.visible .hub-window { transform: scale(1); }
#hub-exit {
    position: absolute;
    top: 25px;
    right: 30px;
    background: rgba(255,255,255,0.05);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}
#hub-exit:hover { background: #ef4444; color: white; }

.hub-tabs {
    display: flex;
    padding: 30px 40px 0;
    border-bottom: 1px solid var(--border);
    gap: 30px;
}
.tab-link {
    background: none;
    border: none;
    color: var(--text-dim);
    padding: 15px 0;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
}
.tab-link.active { color: var(--text); }
.tab-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary);
    box-shadow: 0 -2px 15px var(--primary);
}

.hub-container {
    flex: 1;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
}
.hub-page {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px);
    transition: 0.4s;
    overflow-y: auto;
}
.hub-page.active { opacity: 1; pointer-events: auto; transform: translateY(0); }
.hub-search {
    background: #18181b;
    border: 1px solid #333;
    padding: 14px 24px;
    border-radius: 100px;
    width: 400px;
    color: white;
    text-align: center;
    outline: none;
    transition: all 0.3s;
    margin-bottom: 30px;
}
.hub-search:focus { border-color: var(--primary); width: 450px; }

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 25px;
    width: 100%;
    max-width: 1000px;
    padding-bottom: 50px;
}

.media-card {
    background: #18181b;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    aspect-ratio: 2/3;
    border: 1px solid var(--border);
}
.media-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-color: var(--primary); }
.media-card img { width: 100%; height: 100%; object-fit: cover; }
.media-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    padding: 20px 10px 10px;
    transform: translateY(100%);
    transition: transform 0.3s;
}
.media-card:hover .media-info { transform: translateY(0); }
.media-title { font-size: 14px; font-weight: 600; text-align: center; color: white; }
.media-type { position: absolute; top: 10px; left: 10px; background: var(--primary); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; }

/* Ask UI */
#ask-first-ui {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    z-index: 1200;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
}
#ask-first-ui.active { opacity: 1; visibility: visible; }
.ask-window {
    width: 700px;
    height: 450px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    display: flex;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 100px rgba(var(--primary-rgb), 0.2);
}
#ask-close { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #aaa; cursor: pointer; font-size: 18px; }
.ask-content { display: flex; width: 100%; height: 100%; }
.ask-poster { width: 300px; height: 100%; background-size: cover; background-position: center; }
.ask-details { flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center; }
#ask-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: var(--text); }
#ask-desc { font-size: 13px; color: var(--text-dim); margin-bottom: 30px; line-height: 1.6; }
.ask-actions { display: flex; gap: 15px; }
.primary-btn { flex: 1; background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.secondary-btn { flex: 1; background: transparent; color: var(--text); border: 1px solid var(--border); padding: 12px; border-radius: 8px; cursor: pointer; }

/* VM Interface */
#vm-interface {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 500;
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s;
}
#vm-interface.active { opacity: 1; visibility: visible; pointer-events: auto; }
.vm-loader { height: 3px; width: 0%; background: var(--primary); transition: width 0.5s ease; box-shadow: 0 0 10px var(--primary); }
.vm-topbar { height: 44px; background: #0a0a0a; border-bottom: 1px solid #222; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.vm-actions { display: flex; gap: 8px; }
.vm-btn { width: 12px; height: 12px; border-radius: 50%; cursor: pointer; }
.vm-btn.close { background: #ff5f56; }
.vm-btn.min { background: #ffbd2e; }
.vm-btn.max { background: #27c93f; }
.vm-address-bar { flex: 1; background: #18181b; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #888; gap: 8px; margin: 0 30px; border: 1px solid #222; }
.vm-nav-btn { background: #222; border: 1px solid #333; color: #ccc; font-size: 12px; padding: 5px 14px; border-radius: 6px; cursor: pointer; transition: 0.2s; margin-right: 10px; }
.vm-nav-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
.vm-nav-btn.hidden { display: none; }
#vm-frame { flex: 1; border: none; background: #000; width: 100%; height: 100%; }

/* Sidebar & Ext */
#vm-sidebar-trigger {
    position: absolute;
    bottom: 20px;
    right: 0;
    width: 30px;
    height: 60px;
    background: var(--surface);
    border-radius: 10px 0 0 10px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-dim);
    transition: 0.3s;
    z-index: 600;
}
#vm-sidebar-trigger:hover { width: 40px; color: var(--primary); }
#vm-sidebar {
    position: absolute;
    bottom: 90px;
    right: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(20px);
    transition: 0.3s;
    z-index: 600;
}
#vm-sidebar.active { opacity: 1; pointer-events: auto; transform: translateX(0); }
.sidebar-btn { width: 40px; height: 40px; background: #222; border: 1px solid #333; color: white; border-radius: 8px; cursor: pointer; }
.sidebar-btn:hover { border-color: var(--primary); color: var(--primary); }

#settings-ui, #extension-ui, #next-ep-ui { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 900; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: 0.3s; }
#settings-ui.active, #extension-ui.active, #next-ep-ui.active { opacity: 1; visibility: visible; }
.settings-window, .ext-window, .next-window { width: 400px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
.ext-list { margin-top: 20px; }
.ext-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--border); color: var(--text); }
.ext-item button { background: #222; color: #ccc; border: 1px solid #333; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
.next-window { text-align: center; }
.next-actions { margin-top: 20px; display: flex; gap: 10px; justify-content: center; }
#next-play { background: var(--primary); color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; }
#next-cancel { background: transparent; border: 1px solid #333; color: #ccc; padding: 8px 20px; border-radius: 6px; cursor: pointer; }

#cookie-consent { position: fixed; bottom: 30px; left: 30px; width: 380px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.6); transform: translateY(150%); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); display: block; }
#cookie-consent.show { transform: translateY(0); }
.cookie-content h3 { font-size: 16px; margin-bottom: 8px; color: var(--text); font-weight: 600; }
.cookie-content p { font-size: 13px; color: var(--text-dim); margin-bottom: 16px; line-height: 1.5; }
.cookie-actions { display: flex; gap: 10px; }
#cookie-yes, #cookie-no { flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
#cookie-yes { background: var(--primary); color: white; }
#cookie-no { background: #222; color: #ccc; }

@media (max-width: 768px) {
    #master-input { width: 85vw; }
    #master-input:focus { width: 92vw; }
    .hub-window { width: 100%; height: 100%; border-radius: 0; border: none; }
    .hub-page { padding-top: 80px; }
    .hub-search { width: 85%; }
    .top-controls { top: 20px; left: 20px; }
    .navigation { top: 20px; right: 20px; }
    #cookie-consent { width: 90%; left: 5%; bottom: 20px; }
}
