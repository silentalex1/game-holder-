const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    extensionsEnabled: localStorage.getItem('batprox_ext') === 'true',
    
    themes: {
        void: { p: '#a855f7', rgb: '168, 85, 247', bg: '#030303', s: '#0a0a0a', t: '#ffffff' },
        blossom: { p: '#fbcfe8', rgb: '251, 207, 232', bg: '#1f1016', s: '#29151e', t: '#fce7f3' },
        starwars: { p: '#ffe81f', rgb: '255, 232, 31', bg: '#000000', s: '#111111', t: '#ffe81f' },
        ocean: { p: '#38bdf8', rgb: '56, 189, 248', bg: '#0c4a6e', s: '#075985', t: '#e0f2fe' },
        sunset: { p: '#f472b6', rgb: '244, 114, 182', bg: '#1a0b2e', s: '#2b002b', t: '#ffd1dc' },
        midnight: { p: '#6366f1', rgb: '99, 102, 241', bg: '#0f172a', s: '#1e293b', t: '#e2e8f0' },
        ember: { p: '#f43f5e', rgb: '244, 63, 94', bg: '#0f0505', s: '#1c0a0a', t: '#fff1f2' },
        glitch: { p: '#22d3ee', rgb: '34, 211, 238', bg: '#081012', s: '#0c1a1f', t: '#ecfeff' },
        forest: { p: '#10b981', rgb: '16, 185, 129', bg: '#022c22', s: '#064e3b', t: '#d1fae5' },
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
            MediaLibrary.loadSaved();
            if(localStorage.getItem('batprox_ext') === 'true') {
                document.getElementById('ext-toggle').checked = true;
                BatProx.toggleExtButton(true);
            }
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
        
        // Widget Logic
        document.getElementById('vm-widget-trigger').onclick = () => {
            document.getElementById('vm-widget-panel').classList.toggle('active');
        };
        document.getElementById('vm-wid-menu').onclick = () => { this.kill(); document.getElementById('hub-layer').classList.add('visible'); };
        document.getElementById('vm-wid-set').onclick = () => { document.getElementById('settings-ui').classList.add('active'); };

        // Extensions
        document.getElementById('vm-extensions-btn').onclick = () => {
            document.getElementById('ext-ui').classList.add('active');
        };
        document.getElementById('ext-close').onclick = () => document.getElementById('ext-ui').classList.remove('active');
    },

    toggleExtButton: function(show) {
        const btn = document.getElementById('vm-extensions-btn');
        if(show) btn.classList.remove('hidden'); else btn.classList.add('hidden');
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        let finalTarget = '';

        if (url.includes('.') && !url.includes(' ')) {
            if (!url.startsWith('http')) url = 'https://' + url;
            const blobContent = `
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;overflow:hidden;">
                    <iframe src="${url}" style="width:100%;height:100vh;border:none;" onerror="window.top.location.href='https://html.duckduckgo.com/html?q=${encodeURIComponent(url)}'"></iframe>
                </body>
                </html>
            `;
            const blob = new Blob([blobContent], { type: 'text/html' });
            finalTarget = URL.createObjectURL(blob);
        } else {
            finalTarget = `https://html.duckduckgo.com/html?q=${encodeURIComponent(url)}`;
        }

        this.boot(finalTarget, url);
        document.getElementById('master-input').blur();
    },

    boot: function(target, label) {
        this.vm.classList.add('active');
        this.loader.style.width = '0%';
        this.urlDisplay.innerText = label;
        setTimeout(() => this.loader.style.width = '80%', 50);
        this.frame.src = target;
        setTimeout(() => {
            this.loader.style.width = '100%';
            setTimeout(() => this.loader.style.opacity = '0', 300);
        }, 300);
    },

    kill: function() {
        this.vm.classList.remove('active');
        this.loader.style.width = '0%';
        this.loader.style.opacity = '1';
        setTimeout(() => this.frame.src = 'about:blank', 300);
    }
};

const MediaLibrary = {
    data: [
        { title: "Five Nights at Freddy's", img: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnWd.jpg", id: "507089", type: "movie", desc: "A troubled security guard begins working at Freddy Fazbear's Pizza." },
        { title: "Five Nights at Freddy's 2", img: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", id: "1058694", type: "movie", desc: "Upcoming sequel to the FNAF movie." },
        { title: "Deadpool & Wolverine", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", id: "533535", type: "movie", desc: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool." },
        { title: "Inside Out 2", img: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", id: "1022789", type: "movie", desc: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!" },
        { title: "One Piece", img: "https://image.tmdb.org/t/p/w500/cMD9Ygz11VJmK195pWr35Hsy723.jpg", id: "37854", type: "anime", desc: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the King of All Pirates." },
        { title: "Breaking Bad", img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", id: "1396", type: "tv", desc: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine." },
        { title: "Arcane", img: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", id: "94605", type: "anime", desc: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war." },
        { title: "Stranger Things", img: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", id: "66732", type: "tv", desc: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments." }
    ],
    games: [
        { title: "1v1.lol", img: "https://play-lh.googleusercontent.com/B9tJ3o3JcQyQ7kGz7X0v5o3Yj8q5u8w0t7k6l0s4p2x9r3c5e8n1", url: "https://1v1.lol" },
        { title: "Slope", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6_q_q_q_q_q_q_q_q_q_q_q_q_q_q_q_q_q&s", url: "https://slopegame.io" }
    ],
    saved: [],
    currentItem: null,

    init: function() {
        this.render('movie');
        this.renderGames();
        
        document.getElementById('media-type-selector').onchange = (e) => {
            this.render(e.target.value);
        };

        // Ask First UI Logic
        document.getElementById('ask-close').onclick = () => document.getElementById('ask-first-ui').classList.remove('active');
        
        document.getElementById('ask-play').onclick = () => {
            document.getElementById('ask-first-ui').classList.remove('active');
            if(this.currentItem.url) {
                BatProx.boot(this.currentItem.url, this.currentItem.title);
            } else {
                const url = `https://vidking.net/embed/${this.currentItem.type}/${this.currentItem.id}`;
                BatProx.boot(url, this.currentItem.title);
            }
        };

        document.getElementById('ask-save').onclick = () => {
            if(this.currentItem && !this.saved.find(x => x.id === this.currentItem.id)) {
                this.saved.push(this.currentItem);
                this.saveToStorage();
                this.renderSaved();
                alert('Saved!');
            }
        };

        // Next Episode Logic
        document.getElementById('next-ep-cancel').onclick = () => document.getElementById('next-ep-ui').classList.remove('active');
    },

    render: function(type) {
        const grid = document.getElementById('movies-grid');
        grid.innerHTML = '';
        const filtered = this.data.filter(x => type === 'all' || x.type === type || (type === 'anime' && x.type === 'anime'));
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `<img src="${item.img}" alt="${item.title}"><div class="media-info"><div class="media-title">${item.title}</div></div>`;
            card.onclick = () => this.openAskUI(item);
            grid.appendChild(card);
        });
    },

    renderGames: function() {
        const grid = document.getElementById('games-grid');
        if(!grid) return;
        this.games.forEach(item => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="game-overlay"><div class="game-play-btn">Play Now</div></div>
            `;
            card.onclick = () => BatProx.boot(item.url, item.title);
            grid.appendChild(card);
        });
    },

    renderSaved: function() {
        const grid = document.getElementById('saved-grid');
        grid.innerHTML = '';
        if(this.saved.length === 0) {
            grid.innerHTML = '<div class="empty-state">No saved media.</div>';
            return;
        }
        this.saved.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `<img src="${item.img}" alt="${item.title}"><div class="media-info"><div class="media-title">${item.title}</div></div>`;
            card.onclick = () => this.openAskUI(item);
            grid.appendChild(card);
        });
    },

    openAskUI: function(item) {
        this.currentItem = item;
        document.getElementById('ask-img').src = item.img;
        document.getElementById('ask-title').innerText = item.title;
        document.getElementById('ask-desc').innerText = item.desc || "No description available.";
        document.getElementById('ask-first-ui').classList.add('active');
    },

    saveToStorage: function() {
        if(Config.cookiesAllowed) {
            localStorage.setItem('batprox_saved_media', JSON.stringify(this.saved));
        }
    },

    loadSaved: function() {
        const s = localStorage.getItem('batprox_saved_media');
        if(s) {
            this.saved = JSON.parse(s);
            this.renderSaved();
        }
    }
};

const UI = {
    init: function() {
        this.clock();
        this.text();
        this.handlers();
        this.cookies();
        Config.loadSettings();
        MediaLibrary.init();
    },

    handlers: function() {
        const hub = document.getElementById('hub-layer');
        document.getElementById('menu-btn').onclick = () => { hub.classList.add('visible'); hub.style.visibility = 'visible'; };
        document.getElementById('hub-exit').onclick = () => { hub.classList.remove('visible'); setTimeout(() => hub.style.visibility = 'hidden', 300); };

        const tabs = document.querySelectorAll('.tab-link');
        const pages = document.querySelectorAll('.hub-page');
        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            pages.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(`${t.dataset.view}-view`).classList.add('active');
        });

        const setUi = document.getElementById('settings-ui');
        document.getElementById('settings-btn').onclick = () => { setUi.classList.add('active'); setUi.style.visibility = 'visible'; };
        document.getElementById('settings-close').onclick = () => { setUi.classList.remove('active'); setTimeout(() => setUi.style.visibility = 'hidden', 300); };

        document.getElementById('theme-selector').onchange = (e) => {
            this.applyTheme(e.target.value);
            Config.save('batprox_theme', e.target.value);
        };
        
        document.getElementById('ext-toggle').onchange = (e) => {
            BatProx.toggleExtButton(e.target.checked);
            Config.save('batprox_ext', e.target.checked);
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

        // Engine Toggle
        document.getElementById('starwars-layer').style.display = name === 'starwars' ? 'block' : 'none';
        if(name === 'starwars') StarWarsEngine.enable(); else StarWarsEngine.disable();

        document.getElementById('blossom-canvas').style.display = name === 'blossom' ? 'block' : 'none';
        if(name === 'blossom') BlossomEngine.enable(); else BlossomEngine.disable();

        document.getElementById('ocean-canvas').style.display = name === 'ocean' ? 'block' : 'none';
        if(name === 'ocean') OceanEngine.enable(); else OceanEngine.disable();

        document.getElementById('retro-layer').style.display = name === 'sunset' ? 'block' : 'none';
        
        if(['blossom','starwars','ocean','sunset'].includes(name)) VaporEngine.disable(); else VaporEngine.enable();
    },

    cookies: function() {
        if(!localStorage.getItem('batprox_consent')) {
            setTimeout(() => document.getElementById('cookie-consent').classList.add('show'), 1000);
        }
        document.getElementById('cookie-yes').onclick = () => { localStorage.setItem('batprox_consent', 'true'); Config.cookiesAllowed = true; document.getElementById('cookie-consent').classList.remove('show'); };
        document.getElementById('cookie-no').onclick = () => { localStorage.setItem('batprox_consent', 'false'); Config.cookiesAllowed = false; document.getElementById('cookie-consent').classList.remove('show'); };
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
    ctx: null, w: 0, h: 0, p: [],
    init: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.resize(); window.addEventListener('resize', () => this.resize());
        for(let i=0; i<300; i++) this.spawn();
        this.loop();
    },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    spawn: function() { this.p.push({ x: (Math.random()-0.5)*this.w*2, y: (Math.random()-0.5)*this.h*2, z: Math.random()*this.w, sz: Math.random() }); },
    loop: function() {
        this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
        this.ctx.fillRect(0, 0, this.w, this.h);
        const cx = this.w/2, cy = this.h/2;
        this.p.forEach(p => {
            p.z -= 1.5;
            if(p.z <= 0) { p.z = this.w; p.x = (Math.random()-0.5)*this.w*2; p.y = (Math.random()-0.5)*this.h*2; }
            const k = 250/(250+p.z);
            const x = p.x*k+cx, y = p.y*k+cy, s = (1-p.z/this.w)*3*p.sz, a = (1-p.z/this.w);
            if(x>0&&x<this.w&&y>0&&y<this.h) {
                this.ctx.fillStyle = `rgba(255,255,255,${a})`;
                this.ctx.beginPath(); this.ctx.arc(x,y,s,0,Math.PI*2); this.ctx.fill();
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
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = 450; },
    enable: function() { this.active = true; },
    disable: function() { this.active = false; this.p = []; this.ctx.clearRect(0,0,this.w,this.h); },
    loop: function() {
        if(!this.active) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0, 0, this.w, this.h);
        const style = getComputedStyle(document.documentElement);
        const rgb = style.getPropertyValue('--primary-rgb').trim() || '168, 85, 247';
        if(this.p.length < 130) {
            this.p.push({ x: this.w/2 + (Math.random()-0.5)*110, y: this.h + 20, v: Math.random()*2 + 1, s: Math.random()*30 + 5, l: 1 });
        }
        this.p.forEach((p, i) => {
            p.y -= p.v; p.l -= 0.009; p.x += Math.sin(p.y * 0.05) * 0.5;
            if(p.l <= 0) this.p.splice(i, 1);
            const safeR = Math.max(0.1, p.s);
            this.ctx.beginPath();
            const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, safeR);
            g.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, p.l * 0.7)})`);
            g.addColorStop(0.4, `rgba(${rgb}, ${Math.max(0, p.l * 0.5)})`);
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
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; this.p = []; },
    loop: function() {
        if(!this.active) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0, 0, this.w, this.h);
        if(this.p.length < 50) this.p.push({ x: Math.random()*this.w, y: -20, v: Math.random()*2+1, r: Math.random()*360, s: Math.random()*5+3 });
        this.p.forEach((p, i) => {
            p.y += p.v; p.x += Math.sin(p.y * 0.01); p.r += 1;
            if(p.y > this.h) this.p.splice(i, 1);
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.r * Math.PI / 180);
            this.ctx.fillStyle = '#fbcfe8';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.s, p.s/2, 0, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.restore();
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
        const size = 0.5 + Math.random();
        const topPos = Math.random() * 90;
        const duration = Math.random() * 5 + 10;
        ship.style.transform = `scale(${size}) rotate(90deg)`;
        ship.style.top = `${topPos}%`;
        ship.style.left = '-100px';
        ship.style.transition = `left ${duration}s linear`;
        this.layer.appendChild(ship);
        setTimeout(() => ship.style.left = '110%', 50);
        setTimeout(() => { if(ship.parentNode) ship.parentNode.removeChild(ship); }, duration * 1000);
    }
};

const OceanEngine = {
    canvas: document.getElementById('ocean-canvas'),
    ctx: null, w: 0, h: 0, t: 0, active: false,
    init: function() {
        this.ctx = this.canvas.getContext('2d');
        this.resize(); window.addEventListener('resize', () => this.resize());
        this.loop();
    },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; },
    loop: function() {
        if(!this.active) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0,0,this.w,this.h);
        this.t += 0.01;
        
        for(let i=0; i<3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.h);
            for(let x=0; x<=this.w; x+=20) {
                const y = Math.sin(x*0.005 + this.t + i) * 30 + (this.h - 100 + i*30);
                this.ctx.lineTo(x, y);
            }
            this.ctx.lineTo(this.w, this.h);
            this.ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + i*0.1})`;
            this.ctx.fill();
        }
        requestAnimationFrame(() => this.loop());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BatProx.init();
    UI.init();
    WarpEngine.init();
    VaporEngine.init();
    BlossomEngine.init();
    OceanEngine.init();
});
