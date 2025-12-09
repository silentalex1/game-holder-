const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    
    themes: {
        void: { p: '#a855f7', rgb: '168, 85, 247', bg: '#030303', s: '#0a0a0a', t: '#ffffff' },
        starwars: { p: '#ffe81f', rgb: '255, 232, 31', bg: '#000000', s: '#111111', t: '#ffe81f' },
        midnight: { p: '#6366f1', rgb: '99, 102, 241', bg: '#0f172a', s: '#1e293b', t: '#e2e8f0' },
        ember: { p: '#f43f5e', rgb: '244, 63, 94', bg: '#0f0505', s: '#1c0a0a', t: '#fff1f2' },
        glitch: { p: '#22d3ee', rgb: '34, 211, 238', bg: '#081012', s: '#0c1a1f', t: '#ecfeff' },
        forest: { p: '#10b981', rgb: '16, 185, 129', bg: '#022c22', s: '#064e3b', t: '#d1fae5' },
        ocean: { p: '#3b82f6', rgb: '59, 130, 246', bg: '#1e3a8a', s: '#172554', t: '#dbeafe' },
        sunset: { p: '#f97316', rgb: '249, 115, 22', bg: '#431407', s: '#7c2d12', t: '#ffedd5' },
        gold: { p: '#eab308', rgb: '234, 179, 8', bg: '#1a190b', s: '#29250b', t: '#fefce8' },
        cotton: { p: '#f472b6', rgb: '244, 114, 182', bg: '#1f1016', s: '#2e1a22', t: '#fce7f3' },
        dracula: { p: '#bd93f9', rgb: '189, 147, 249', bg: '#282a36', s: '#44475a', t: '#f8f8f2' },
        matrix: { p: '#00ff41', rgb: '0, 255, 65', bg: '#000000', s: '#0d0d0d', t: '#e0ffe4' },
        royal: { p: '#c084fc', rgb: '192, 132, 252', bg: '#170b29', s: '#251b3b', t: '#f3e8ff' }
    },

    save: function(key, val) {
        if(this.cookiesAllowed) localStorage.setItem(key, val);
    },

    loadSettings: function() {
        if(this.cookiesAllowed) {
            const savedTheme = localStorage.getItem('batprox_theme');
            if(savedTheme) UI.applyTheme(savedTheme);
        }
    }
};

const BatProx = {
    vm: document.getElementById('vm-interface'),
    frame: document.getElementById('vm-frame'),
    loader: document.querySelector('.vm-loader'),
    urlDisplay: document.getElementById('vm-url-text'),

    init: function() {
        const input = document.getElementById('master-input');
        
        input.addEventListener('keydown', (e) => {
            e.stopPropagation(); 
            if (e.key === 'Enter') this.route(input.value);
        });

        document.getElementById('vm-terminate').addEventListener('click', () => this.kill());
        document.getElementById('vm-exit-browse').addEventListener('click', () => this.kill());
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        let displayLabel = url;
        let finalTarget = '';

        if (!url.includes('.') || url.includes(' ')) {
            // Search query fallback using DuckDuckGo HTML version (Very permissive)
            finalTarget = 'https://html.duckduckgo.com/html?q=' + encodeURIComponent(url);
        } else {
            // Bypass Logic: Force DDG Lite for known tough sites to avoid "Refused to Connect"
            if (url.includes('roblox.com') || 
                url.includes('google.com') || 
                url.includes('discord.com')) {
                finalTarget = 'https://html.duckduckgo.com/html?q=site:' + encodeURIComponent(url);
            } else {
                if (!url.startsWith('http')) {
                    finalTarget = 'https://' + url;
                } else {
                    finalTarget = url;
                }
            }
        }

        this.boot(finalTarget, displayLabel);
        document.getElementById('master-input').blur();
    },

    boot: function(target, label) {
        this.vm.classList.add('active');
        this.loader.style.width = '0%';
        this.urlDisplay.innerText = label;
        
        setTimeout(() => this.loader.style.width = '80%', 50);

        this.frame.src = 'about:blank';

        const blobContent = `
            <!DOCTYPE html>
            <html style="height:100%;margin:0;">
            <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="margin:0;height:100%;overflow:hidden;background:#fff;">
                <iframe src="${target}" style="width:100%;height:100%;border:none;" referrerpolicy="no-referrer" allowfullscreen sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"></iframe>
            </body>
            </html>
        `;

        const blob = new Blob([blobContent], { type: 'text/html' });
        
        setTimeout(() => {
            this.frame.src = URL.createObjectURL(blob);
            this.loader.style.width = '100%';
            setTimeout(() => this.loader.style.opacity = '0', 300);
        }, 200);
    },

    kill: function() {
        this.vm.classList.remove('active');
        this.loader.style.width = '0%';
        this.loader.style.opacity = '1';
        setTimeout(() => this.frame.src = 'about:blank', 300);
    }
};

const StarWarsEngine = {
    layer: document.getElementById('starwars-layer'),
    active: false,
    interval: null,

    enable: function() {
        if(this.active) return;
        this.active = true;
        this.layer.style.display = 'block';
        this.spawnLoop();
    },

    disable: function() {
        this.active = false;
        this.layer.style.display = 'none';
        this.layer.innerHTML = '';
        if(this.interval) clearInterval(this.interval);
    },

    spawnLoop: function() {
        this.interval = setInterval(() => {
            if(!this.active) return;
            this.spawnShip();
        }, 4000);
    },

    spawnShip: function() {
        const ship = document.createElement('div');
        ship.classList.add('ship-destroyer');
        
        const engine = document.createElement('div');
        engine.classList.add('ship-engine');
        ship.appendChild(engine);

        const size = Math.random() * 60 + 40;
        const topPos = Math.random() * 80 + 10;
        const duration = Math.random() * 10 + 15;

        ship.style.width = `${size}px`;
        ship.style.height = `${size * 1.5}px`;
        ship.style.top = `${topPos}%`;
        ship.style.left = '-100px';
        ship.style.animation = `fly-across ${duration}s linear infinite`;

        this.layer.appendChild(ship);

        setTimeout(() => {
            if(ship.parentNode) ship.parentNode.removeChild(ship);
        }, duration * 1000);
    }
};

const UI = {
    init: function() {
        this.clock();
        this.text();
        this.handlers();
        this.cookies();
        Config.loadSettings();
    },

    handlers: function() {
        const hub = document.getElementById('hub-layer');
        document.getElementById('menu-btn').onclick = () => {
            hub.classList.add('visible');
            hub.style.visibility = 'visible';
        };
        document.getElementById('hub-exit').onclick = () => {
            hub.classList.remove('visible');
            setTimeout(() => hub.style.visibility = 'hidden', 300);
        };

        const tabs = document.querySelectorAll('.tab-link');
        const pages = document.querySelectorAll('.hub-page');
        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            pages.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(`${t.dataset.view}-view`).classList.add('active');
        });

        const setUi = document.getElementById('settings-ui');
        document.getElementById('settings-btn').onclick = () => {
            setUi.classList.add('active');
            setUi.style.visibility = 'visible';
        };
        document.getElementById('settings-close').onclick = () => {
            setUi.classList.remove('active');
            setTimeout(() => setUi.style.visibility = 'hidden', 300);
        };

        document.getElementById('theme-selector').onchange = (e) => {
            this.applyTheme(e.target.value);
            Config.save('batprox_theme', e.target.value);
        };
    },

    applyTheme: function(name) {
        const t = Config.themes[name];
        if(!t) return;
        
        const r = document.documentElement.style;
        r.setProperty('--primary', t.p);
        r.setProperty('--primary-rgb', t.rgb);
        r.setProperty('--bg', t.bg);
        r.setProperty('--surface', t.s);
        r.setProperty('--text', t.t);
        
        document.getElementById('theme-selector').value = name;

        if(name === 'starwars') {
            StarWarsEngine.enable();
        } else {
            StarWarsEngine.disable();
        }
    },

    cookies: function() {
        if(!localStorage.getItem('batprox_consent')) {
            setTimeout(() => document.getElementById('cookie-consent').classList.add('show'), 1000);
        }

        document.getElementById('cookie-yes').onclick = () => {
            localStorage.setItem('batprox_consent', 'true');
            Config.cookiesAllowed = true;
            document.getElementById('cookie-consent').classList.remove('show');
        };

        document.getElementById('cookie-no').onclick = () => {
            localStorage.setItem('batprox_consent', 'false');
            Config.cookiesAllowed = false;
            document.getElementById('cookie-consent').classList.remove('show');
        };
    },

    clock: function() {
        const el = document.getElementById('clock-display');
        setInterval(() => {
            const d = new Date();
            let h = d.getHours();
            const ap = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            const m = d.getMinutes().toString().padStart(2, '0');
            const s = d.getSeconds().toString().padStart(2, '0');
            const mo = (d.getMonth()+1).toString().padStart(2, '0');
            const da = d.getDate().toString().padStart(2, '0');
            el.innerText = `${h}:${m}:${s} ${ap} - ${mo}/${da}/${d.getFullYear()}`;
        }, 1000);
    },

    text: function() {
        const el = document.getElementById('dynamic-text');
        const msgs = [
            "The best proxy of them all. Goes to BatProx.",
            "BatProx was made in 2024 but didn't work now it does and is rewritten.",
            "BatProx is its own and new proxy.",
            "Fastest of them all."
        ];
        let i = 0;
        setInterval(() => {
            el.classList.add('text-cycle');
            setTimeout(() => {
                i = (i + 1) % msgs.length;
                el.innerText = msgs[i];
                el.classList.remove('text-cycle');
            }, 300);
        }, 4000);
    }
};

const WarpEngine = {
    canvas: document.getElementById('warp-canvas'),
    ctx: null,
    w: 0,
    h: 0,
    p: [],

    init: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.resize();
        window.addEventListener('resize', () => this.resize());
        for(let i=0; i<300; i++) this.spawn();
        this.loop();
    },

    resize: function() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
    },

    spawn: function() {
        this.p.push({
            x: (Math.random()-0.5) * this.w * 2,
            y: (Math.random()-0.5) * this.h * 2,
            z: Math.random() * this.w,
            sz: Math.random()
        });
    },

    loop: function() {
        this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
        this.ctx.fillRect(0, 0, this.w, this.h);
        
        const cx = this.w/2;
        const cy = this.h/2;
        
        this.p.forEach(p => {
            p.z -= 1.5;
            if(p.z <= 0) {
                p.z = this.w;
                p.x = (Math.random()-0.5) * this.w * 2;
                p.y = (Math.random()-0.5) * this.h * 2;
            }
            
            const k = 250 / (250 + p.z);
            const x = p.x * k + cx;
            const y = p.y * k + cy;
            const s = (1 - p.z/this.w) * 3 * p.sz;
            const a = (1 - p.z/this.w);
            
            if(x>0 && x<this.w && y>0 && y<this.h) {
                this.ctx.fillStyle = `rgba(255,255,255,${a})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, s, 0, Math.PI*2);
                this.ctx.fill();
            }
        });
        
        requestAnimationFrame(() => this.loop());
    }
};

const VaporEngine = {
    canvas: document.getElementById('vapor-canvas'),
    ctx: null,
    w: 0,
    h: 0,
    p: [],

    init: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    },

    resize: function() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = 400;
    },

    loop: function() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        
        const style = getComputedStyle(document.documentElement);
        const rgb = style.getPropertyValue('--primary-rgb').trim() || '168, 85, 247';
        
        if(this.p.length < 130) {
            this.p.push({
                x: this.w/2 + (Math.random()-0.5)*110,
                y: this.h + 20,
                v: Math.random()*2 + 1,
                s: Math.random()*30 + 5,
                l: 1
            });
        }

        this.p.forEach((p, i) => {
            p.y -= p.v;
            p.l -= 0.009;
            p.x += Math.sin(p.y * 0.05) * 0.5;
            
            if(p.l <= 0) this.p.splice(i, 1);
            
            this.ctx.beginPath();
            const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
            g.addColorStop(0, `rgba(255, 255, 255, ${p.l * 0.7})`);
            g.addColorStop(0.4, `rgba(${rgb}, ${p.l * 0.5})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = g;
            this.ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.loop());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BatProx.init();
    UI.init();
    WarpEngine.init();
    VaporEngine.init();
});
