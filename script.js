const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    
    themes: {
        void: { p: '#a855f7', bg: '#030303', s: '#0a0a0a', t: '#fff' },
        midnight: { p: '#6366f1', bg: '#0f172a', s: '#1e293b', t: '#e2e8f0' },
        ember: { p: '#f43f5e', bg: '#0f0505', s: '#1c0a0a', t: '#fff1f2' },
        glitch: { p: '#22d3ee', bg: '#081012', s: '#0c1a1f', t: '#ecfeff' },
        pure: { p: '#000000', bg: '#ffffff', s: '#f4f4f5', t: '#18181b' }
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
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        
        if (!url.includes('.') || url.includes(' ')) {
            url = 'https://www.bing.com/search?q=' + encodeURIComponent(url);
        } else if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        this.boot(url);
        document.getElementById('master-input').blur();
    },

    boot: function(target) {
        this.vm.classList.add('active');
        this.loader.style.width = '0%';
        this.urlDisplay.innerText = target.substring(0, 50);
        
        
        setTimeout(() => this.loader.style.width = '70%', 50);

        this.frame.src = 'about:blank';

        const blobContent = `
            <!DOCTYPE html>
            <html style="height:100%;margin:0;">
            <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="margin:0;height:100%;overflow:hidden;">
                <iframe src="${target}" style="width:100%;height:100%;border:none;" referrerpolicy="no-referrer" allowfullscreen></iframe>
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

const UI = {
    init: function() {
        this.detectDevice();
        this.clock();
        this.text();
        this.handlers();
        this.cookies();
        Config.loadSettings();
    },

    detectDevice: function() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            document.body.classList.add('mobile-device');
        }
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

        // Settings Handlers
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
        r.setProperty('--bg', t.bg);
        r.setProperty('--surface', t.s);
        r.setProperty('--text', t.t);
        r.setProperty('--primary-glow', `${t.p}66`);
        
        
        document.getElementById('theme-selector').value = name;
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
            const mo = (d.getMonth()+1).toString().padStart(2, '0');
            const da = d.getDate().toString().padStart(2, '0');
            el.innerText = `${h}:${m} ${ap} - ${mo}/${da}/${d.getFullYear()}`;
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
        
        if(this.p.length < 100) {
            this.p.push({
                x: this.w/2 + (Math.random()-0.5)*100,
                y: this.h + 20,
                v: Math.random()*2 + 1,
                s: Math.random()*30 + 10,
                l: 1
            });
        }

        this.p.forEach((p, i) => {
            p.y -= p.v;
            p.l -= 0.01;
            
            if(p.l <= 0) this.p.splice(i, 1);
            
            this.ctx.beginPath();
            const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
            g.addColorStop(0, `rgba(255, 255, 255, ${p.l * 0.8})`);
            g.addColorStop(0.5, `rgba(168, 85, 247, ${p.l * 0.4})`);
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
    VaporEngine.init();
});
