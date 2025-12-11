const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    
    themes: {
        void: { p: '#a855f7', bg: '#030303' },
        ocean: { p: '#3b82f6', bg: '#0f172a' },
        sunset: { p: '#f97316', bg: '#431407' },
        blossom: { p: '#fbcfe8', bg: '#1f1016' },
        starwars: { p: '#ffe81f', bg: '#000000' }
    },

    save: function(key, val) {
        if(this.cookiesAllowed) localStorage.setItem(key, val);
    }
};

const BatProx = {
    vm: document.getElementById('vm-interface'),
    frame: document.getElementById('vm-frame'),
    loader: document.querySelector('.vm-loader'),

    init: function() {
        const input = document.getElementById('master-input');
        if(input) {
            input.addEventListener('keydown', (e) => {
                e.stopPropagation(); 
                if (e.key === 'Enter') this.route(input.value);
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        }

        const exitBtn = document.getElementById('vm-exit-browse');
        if(exitBtn) exitBtn.onclick = () => this.kill();
        
        const menuBtn = document.getElementById('vm-menu-btn');
        if(menuBtn) menuBtn.onclick = () => {
             document.getElementById('hub-layer').classList.add('visible');
             this.kill(); 
        };
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        let target = '';

        if (url.includes('.') && !url.includes(' ')) {
             if (!url.startsWith('http')) url = 'https://' + url;
             target = `/api/proxy?url=${encodeURIComponent(url)}`;
        } else {
             target = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
        }

        this.boot(target);
        const input = document.getElementById('master-input');
        if(input) input.blur();
    },

    boot: function(target) {
        if(!this.vm) return;
        this.vm.classList.add('active');
        this.frame.src = target;
    },

    kill: function() {
        if(!this.vm) return;
        this.vm.classList.remove('active');
        this.frame.src = 'about:blank';
    }
};

const MediaLibrary = {
    data: [
        { title: "Five Nights at Freddy's 2", img: "https://image.tmdb.org/t/p/w500/m1t4t2B0b7e2e3e4e5e6e7e8.jpg", id: "1058694", type: "movie", desc: "Mike Schmidt returns." },
        { title: "Five Nights at Freddy's", img: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg", id: "507089", type: "movie", desc: "A troubled security guard." },
        { title: "Deadpool & Wolverine", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", id: "533535", type: "movie", desc: "Wolverine recovering." },
        { title: "Inside Out 2", img: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", id: "1022789", type: "movie", desc: "New emotions." },
        { title: "Moana 2", img: "https://image.tmdb.org/t/p/w500/m0SbwFZsY9FvYHMpphTi0k0Xn75.jpg", id: "1241982", type: "movie", desc: "Wayfinding ancestors." },
        { title: "Sonic 3", img: "https://image.tmdb.org/t/p/w500/d8Ryb8AunYAuyc3J4fvo24Is982.jpg", id: "939243", type: "movie", desc: "Shadow emerges." },
        { title: "One Piece", img: "https://image.tmdb.org/t/p/w500/cMD9Ygz11VJmK195pWr35Hsy723.jpg", id: "37854", type: "anime", desc: "Monkey D. Luffy." },
        { title: "Arcane", img: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", id: "94605", type: "anime", desc: "Piltover and Zaun." },
        { title: "Breaking Bad", img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", id: "1396", type: "tv", desc: "Cooking meth." },
        { title: "Squid Game", img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg", id: "93405", type: "tv", desc: "Deadly games." }
    ],
    saved: [],
    currentItem: null,

    init: function() {
        this.render('movie');
        this.renderGames();
        
        const selector = document.getElementById('media-type-selector');
        if(selector) selector.onchange = (e) => {
            e.stopPropagation();
            this.render(e.target.value);
        };
        
        const playBtn = document.getElementById('ask-play');
        if(playBtn) playBtn.onclick = (e) => {
            e.stopPropagation();
            document.getElementById('ask-ui').classList.remove('active');
            BatProx.boot(`https://vidking.net/embed/${this.currentItem.type}/${this.currentItem.id}`);
            document.getElementById('hub-layer').classList.remove('visible');
        };

        const saveBtn = document.getElementById('ask-save');
        if(saveBtn) saveBtn.onclick = (e) => {
            e.stopPropagation();
            if(!this.saved.find(x => x.id === this.currentItem.id)) {
                this.saved.push(this.currentItem);
                Config.save('batprox_saved', JSON.stringify(this.saved));
                this.renderSaved();
                alert('Saved!');
            }
        };

        document.getElementById('ask-close-main').onclick = () => document.getElementById('ask-ui').classList.remove('active');
    },

    renderGames: function() {
        const grid = document.getElementById('games-grid');
        if(!grid) return;
        grid.innerHTML = '<div class="empty-state" style="color:#666">Games coming soon...</div>';
    },

    render: function(type) {
        const grid = document.getElementById('movies-grid');
        if(!grid) return;
        grid.innerHTML = '';
        const filtered = this.data.filter(x => x.type === type || (type === 'anime' && x.type === 'anime'));
        filtered.forEach(item => this.createCard(item, grid));
    },

    renderSaved: function() {
        const grid = document.getElementById('saved-grid');
        if(!grid) return;
        grid.innerHTML = '';
        const s = localStorage.getItem('batprox_saved');
        if(s) this.saved = JSON.parse(s);
        if(this.saved.length === 0) grid.innerHTML = '<div style="color:#666">No saved media.</div>';
        this.saved.forEach(item => this.createCard(item, grid));
    },

    createCard: function(item, container) {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="media-info"><div class="media-title">${item.title}</div></div>
            <div class="play-overlay"><span class="play-btn">Play Now</span></div>
        `;
        card.onclick = (e) => {
            e.stopPropagation();
            this.currentItem = item;
            document.getElementById('ask-title').innerText = item.title;
            document.getElementById('ask-desc').innerText = item.desc;
            document.getElementById('ask-ui').classList.add('active');
        };
        container.appendChild(card);
    }
};

const UI = {
    init: function() {
        this.clock();
        this.text();
        this.handlers();
        this.cookies();
        const savedTheme = localStorage.getItem('batprox_theme') || 'void';
        this.applyTheme(savedTheme);
        MediaLibrary.init();
        MediaLibrary.renderSaved();
    },

    updateFavicon: function() {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path d='M32 40 C 20 40 10 30 2 20 Q 15 20 22 28 C 22 20 28 15 32 15 C 36 15 42 20 42 28 Q 49 20 62 20 C 54 30 44 40 32 40 Z' fill='#000000' stroke='#a855f7' stroke-width='3'/></svg>`;
        document.getElementById('dynamic-favicon').href = 'data:image/svg+xml;base64,' + btoa(svg);
    },

    handlers: function() {
        const hub = document.getElementById('hub-layer');
        const settings = document.getElementById('settings-ui');
        
        document.getElementById('menu-btn').onclick = (e) => { e.stopPropagation(); hub.classList.add('visible'); };
        document.getElementById('settings-btn').onclick = (e) => { e.stopPropagation(); settings.classList.add('active'); };
        
        document.getElementById('hub-exit').onclick = () => hub.classList.remove('visible');
        document.getElementById('settings-close').onclick = () => settings.classList.remove('active');

        const tabs = document.querySelectorAll('.tab-link');
        const pages = document.querySelectorAll('.hub-page');
        tabs.forEach(t => t.onclick = (e) => {
            e.stopPropagation();
            tabs.forEach(x => x.classList.remove('active'));
            pages.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(`${t.dataset.view}-view`).classList.add('active');
        });

        document.getElementById('theme-selector').onchange = (e) => {
            e.stopPropagation();
            this.applyTheme(e.target.value);
            Config.save('batprox_theme', e.target.value);
        };
    },

    applyTheme: function(name) {
        const t = Config.themes[name] || Config.themes.void;
        const r = document.documentElement.style;
        r.setProperty('--primary', t.p);
        r.setProperty('--bg', t.bg);
        
        const toggle = (id, state) => {
            const el = document.getElementById(id);
            if(el) el.style.display = state ? 'block' : 'none';
        };
        
        toggle('starwars-layer', name === 'starwars');
        if(name === 'starwars') StarWarsEngine.enable(); else StarWarsEngine.disable();

        toggle('blossom-canvas', name === 'blossom');
        if(name === 'blossom') BlossomEngine.enable(); else BlossomEngine.disable();

        if(name === 'void') WarpEngine.snowMode(true); else WarpEngine.snowMode(false);
        if(['void','ember','midnight'].includes(name)) VaporEngine.enable(); else VaporEngine.disable();
    },

    cookies: function() {
        if(!localStorage.getItem('batprox_consent')) {
            setTimeout(() => document.getElementById('cookie-consent').classList.add('show'), 500);
        }
        document.getElementById('cookie-yes').onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('batprox_consent', 'true');
            Config.cookiesAllowed = true;
            document.getElementById('cookie-consent').classList.remove('show');
        };
        document.getElementById('cookie-no').onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('batprox_consent', 'false');
            document.getElementById('cookie-consent').classList.remove('show');
        };
    },

    clock: function() {
        const el = document.getElementById('clock-display');
        if(!el) return;
        setInterval(() => {
            const d = new Date();
            el.innerText = d.toLocaleTimeString() + ' - ' + d.toLocaleDateString();
        }, 1000);
    },

    text: function() {
        const el = document.getElementById('dynamic-text');
        if(!el) return;
        const msgs = ["The best proxy.", "BatProx is fast.", "Unblock everything."];
        let i = 0;
        setInterval(() => {
            el.innerText = msgs[i];
            i = (i + 1) % msgs.length;
        }, 4000);
    }
};

const WarpEngine = {
    canvas: document.getElementById('warp-canvas'),
    ctx: null, w: 0, h: 0, p: [], isSnow: true,
    init: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.resize(); window.addEventListener('resize', () => this.resize());
        for(let i=0; i<300; i++) this.spawn();
        this.loop();
    },
    snowMode: function(active) { this.isSnow = active; },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    spawn: function() { this.p.push({ x: (Math.random()-0.5)*this.w*2, y: (Math.random()-0.5)*this.h*2, z: Math.random()*this.w, sz: Math.random() }); },
    loop: function() {
        if(!this.ctx) return;
        this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
        this.ctx.fillRect(0, 0, this.w, this.h);
        const cx = this.w/2, cy = this.h/2;
        this.p.forEach(p => {
            p.z -= 2;
            if(p.z <= 0) { p.z = this.w; p.x = (Math.random()-0.5)*this.w*2; p.y = (Math.random()-0.5)*this.h*2; }
            const k = 250/(250+p.z);
            const x = p.x*k+cx, y = p.y*k+cy, s = (1-p.z/this.w)*4*p.sz;
            if(x>0&&x<this.w&&y>0&&y<this.h) {
                this.ctx.fillStyle = `rgba(255,255,255,${1-p.z/this.w})`;
                this.ctx.beginPath(); 
                this.ctx.arc(x, y, Math.max(0, s), 0, Math.PI*2); 
                this.ctx.fill();
            }
        });
        requestAnimationFrame(() => this.loop());
    }
};

const VaporEngine = {
    canvas: document.getElementById('vapor-canvas'),
    ctx: null, w: 0, h: 0, p: [], active: true,
    init: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.resize(); window.addEventListener('resize', () => this.resize());
        this.loop();
    },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = 450; },
    enable: function() { this.active = true; },
    disable: function() { this.active = false; if(this.ctx) this.ctx.clearRect(0,0,this.w,this.h); },
    loop: function() {
        if(!this.active || !this.ctx) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0, 0, this.w, this.h);
        if(this.p.length < 130) {
            this.p.push({ x: this.w/2 + (Math.random()-0.5)*110, y: this.h + 20, v: Math.random()*2 + 1, s: Math.random()*30 + 5, l: 1 });
        }
        this.p.forEach((p, i) => {
            p.y -= p.v; p.l -= 0.009;
            if(p.l <= 0) this.p.splice(i, 1);
            const safeR = Math.max(0.1, Math.abs(p.s));
            this.ctx.beginPath();
            const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, safeR);
            g.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, p.l * 0.7)})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            this.ctx.fillStyle = g;
            this.ctx.arc(p.x, p.y, safeR, 0, Math.PI*2);
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.loop());
    }
};

const BlossomEngine = {
    canvas: document.getElementById('blossom-canvas'),
    ctx: null, w: 0, h: 0, p: [], active: false,
    init: function() {
        this.ctx = this.canvas.getContext('2d');
        this.resize(); window.addEventListener('resize', () => this.resize());
        this.loop();
    },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; },
    loop: function() {
        if(!this.active || !this.ctx) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0, 0, this.w, this.h);
        if(this.p.length < 50) this.p.push({ x: Math.random()*this.w, y: -20, v: Math.random()*2+1, s: Math.random()*5+3 });
        this.p.forEach((p, i) => {
            p.y += p.v;
            if(p.y > this.h) this.p.splice(i, 1);
            this.ctx.fillStyle = '#fbcfe8';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.loop());
    }
};

const StarWarsEngine = {
    layer: document.getElementById('starwars-layer'),
    active: false, interval: null,
    enable: function() { if(this.active) return; this.active = true; this.layer.style.display = 'block'; this.spawnLoop(); },
    disable: function() { this.active = false; this.layer.style.display = 'none'; this.layer.innerHTML = ''; if(this.interval) clearInterval(this.interval); },
    spawnLoop: function() {
        this.interval = setInterval(() => { if(this.active) this.spawnShip(); }, 3000);
    },
    spawnShip: function() {
        const ship = document.createElement('div');
        ship.classList.add('tie-fighter');
        ship.innerHTML = '<div class="tie-wing-l"></div><div class="tie-wing-r"></div><div class="tie-center"><div class="tie-window"></div></div>';
        ship.style.top = `${Math.random() * 90}%`;
        ship.style.left = '-100px';
        ship.style.transition = `left 10s linear`;
        this.layer.appendChild(ship);
        setTimeout(() => ship.style.left = '110%', 50);
        setTimeout(() => { if(ship.parentNode) ship.parentNode.removeChild(ship); }, 10000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BatProx.init();
    UI.init();
    WarpEngine.init();
    VaporEngine.init();
    BlossomEngine.init();
    StarWarsEngine.disable(); 
});
