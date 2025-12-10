const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    extensionsEnabled: localStorage.getItem('batprox_ext') === 'true',
    
    themes: {
        void: { p: '#a855f7', rgb: '168, 85, 247', bg: '#030303', s: '#0a0a0a', t: '#ffffff' },
        ocean: { p: '#3b82f6', rgb: '59, 130, 246', bg: '#0f172a', s: '#1e293b', t: '#e2e8f0' },
        sunset: { p: '#f97316', rgb: '249, 115, 22', bg: '#431407', s: '#7c2d12', t: '#ffedd5' },
        blossom: { p: '#fbcfe8', rgb: '251, 207, 232', bg: '#1f1016', s: '#29151e', t: '#fce7f3' },
        starwars: { p: '#ffe81f', rgb: '255, 232, 31', bg: '#000000', s: '#111111', t: '#ffe81f' },
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
            if(this.extensionsEnabled) {
                document.getElementById('ext-toggle').checked = true;
                BatProx.toggleExtensions(true);
            }
        }
    }
};

const BatProx = {
    vm: document.getElementById('vm-interface'),
    frame: document.getElementById('vm-frame'),
    loader: document.querySelector('.vm-loader'),

    init: function() {
        const input = document.getElementById('master-input');
        input.addEventListener('keydown', (e) => {
            e.stopPropagation(); 
            if (e.key === 'Enter') this.route(input.value);
        });

        document.getElementById('vm-exit-browse').addEventListener('click', () => this.kill());
        document.getElementById('vm-toggle-sidebar').addEventListener('click', () => {
            document.getElementById('vm-sidebar').classList.toggle('collapsed');
        });
        
        document.getElementById('vm-menu-btn').onclick = () => {
             document.getElementById('hub-layer').classList.add('visible');
             this.kill(); 
        };
        document.getElementById('vm-settings-btn').onclick = () => {
            this.kill();
            document.getElementById('settings-ui').classList.add('active');
        };
        document.getElementById('vm-api-btn').onclick = () => window.location.href = '/ourapi';
        document.getElementById('vm-ext-btn').onclick = () => {
             document.getElementById('ext-ui').classList.add('active');
        };
    },

    toggleExtensions: function(enable) {
        const btn = document.getElementById('vm-ext-btn');
        if(enable) btn.classList.remove('hidden'); else btn.classList.add('hidden');
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        let finalTarget = '';

        if (url.includes('.') && !url.includes(' ')) {
             if (!url.startsWith('http')) url = 'https://' + url;
             finalTarget = `https://www.google.com/search?igu=1&q=site:${encodeURIComponent(url)}`;
        } else {
             finalTarget = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
        }

        this.boot(finalTarget);
        document.getElementById('master-input').blur();
    },

    boot: function(target) {
        this.vm.classList.add('active');
        this.loader.style.width = '0%';
        setTimeout(() => this.loader.style.width = '100%', 50);
        this.frame.src = target;
        setTimeout(() => this.loader.style.opacity = '0', 500);
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
        { title: "Five Nights at Freddy's", img: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg", id: "507089", type: "movie", desc: "A troubled security guard begins working at Freddy Fazbear's Pizza." },
        { title: "Deadpool & Wolverine", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", id: "533535", type: "movie", desc: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool." },
        { title: "Inside Out 2", img: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", id: "1022789", type: "movie", desc: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new emotions!" },
        { title: "Wicked", img: "https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csUm7j3hlQw.jpg", id: "402431", type: "movie", desc: "Elphaba, a misunderstood young woman because of her green skin, and Glinda, a popular girl, become friends at Shiz University." },
        { title: "Moana 2", img: "https://image.tmdb.org/t/p/w500/m0SbwFZsY9FvYHMpphTi0k0Xn75.jpg", id: "1241982", type: "movie", desc: "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew." },
        { title: "Gladiator II", img: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmf4oo6747ffrp.jpg", id: "558449", type: "movie", desc: "After his home is conquered by the tyrannical Emperors who now lead Rome, Lucius is forced to enter the Colosseum." },
        { title: "Sonic the Hedgehog 3", img: "https://image.tmdb.org/t/p/w500/d8Ryb8AunYAuyc3J4fvo24Is982.jpg", id: "939243", type: "movie", desc: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before." },
        { title: "Mufasa: The Lion King", img: "https://image.tmdb.org/t/p/w500/jbOSUAWMGzGL1L4EaUF8veTVri9.jpg", id: "762509", type: "movie", desc: "Told in flashbacks, Mufasa is an orphaned cub, lost and alone until he meets a sympathetic lion named Taka." },
        { title: "One Piece", img: "https://image.tmdb.org/t/p/w500/cMD9Ygz11VJmK195pWr35Hsy723.jpg", id: "37854", type: "anime", desc: "Monkey D. Luffy sails the seas to find the One Piece." },
        { title: "Arcane", img: "https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", id: "94605", type: "anime", desc: "Set in Utopian Piltover and the oppressed underground of Zaun." },
        { title: "Jujutsu Kaisen", img: "https://image.tmdb.org/t/p/w500/fcv2TRuJbQAxJ79qOgM1bjj7qXJ.jpg", id: "95479", type: "anime", desc: "Yuji Itadori, a boy with tremendous physical strength, consumes a cursed object and becomes the host of a powerful curse." },
        { title: "Demon Slayer", img: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQSCGPGFzmant.jpg", id: "85937", type: "anime", desc: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon." },
        { title: "Chainsaw Man", img: "https://image.tmdb.org/t/p/w500/npdB6eFzizki0WaZ1CiKcjf0W8y.jpg", id: "114410", type: "anime", desc: "Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes." },
        { title: "Solo Leveling", img: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xc32JH60ymTR.jpg", id: "242095", type: "anime", desc: "Ten years ago, the Gate appeared and connected the real world with the world of magic and monsters." },
        { title: "Breaking Bad", img: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", id: "1396", type: "tv", desc: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine." },
        { title: "Stranger Things", img: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", id: "66732", type: "tv", desc: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl." },
        { title: "The Boys", img: "https://image.tmdb.org/t/p/w500/7nsJ8K3awwL2iY6M6W3d8z9W7X2.jpg", id: "76479", type: "tv", desc: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers." },
        { title: "Fallout", img: "https://image.tmdb.org/t/p/w500/8c7a886d3b451433f52879f9722.jpg", id: "106379", type: "tv", desc: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants and bandits." },
        { title: "Squid Game", img: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg", id: "93405", type: "tv", desc: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes." },
        { title: "1v1.lol", img: "https://play-lh.googleusercontent.com/1-f-4g-a-q-z-x-c-v-b-n-m", id: "game-1v1", type: "game", url: "https://1v1.lol", desc: "Online building and shooting simulator." }
    ],
    saved: [],
    currentItem: null,

    init: function() {
        this.render('movie');
        this.renderGames();
        
        document.getElementById('media-type-selector').onchange = (e) => this.render(e.target.value);
        
        document.getElementById('ask-play').onclick = () => {
            document.getElementById('ask-ui').classList.remove('active');
            if(this.currentItem.type === 'game') {
                BatProx.boot(this.currentItem.url);
            } else {
                const url = `https://vidking.net/embed/${this.currentItem.type}/${this.currentItem.id}`;
                BatProx.boot(url);
                setTimeout(() => {
                    document.getElementById('next-desc').innerText = `Continue next: ${this.currentItem.title}`;
                    document.getElementById('next-ep-ui').classList.add('active');
                }, 15000); 
            }
        };

        document.getElementById('ask-save').onclick = () => {
            if(!this.saved.find(x => x.id === this.currentItem.id)) {
                this.saved.push(this.currentItem);
                this.saveToStorage();
                this.renderSaved();
                alert('Saved!');
            }
        };

        document.getElementById('ask-close').onclick = () => document.getElementById('ask-ui').classList.remove('active');
        document.getElementById('next-close').onclick = () => document.getElementById('next-ep-ui').classList.remove('active');
        document.getElementById('next-play').onclick = () => {
            document.getElementById('next-ep-ui').classList.remove('active');
            BatProx.boot(`https://vidking.net/embed/${this.currentItem.type}/${this.currentItem.id}`);
        };
    },

    renderGames: function() {
        const grid = document.getElementById('games-grid');
        grid.innerHTML = '';
        const games = this.data.filter(x => x.type === 'game');
        if(games.length === 0) grid.innerHTML = '<div class="empty-state">No games available.</div>';
        
        games.forEach(item => this.createCard(item, grid));
    },

    render: function(type) {
        const grid = document.getElementById('movies-grid');
        grid.innerHTML = '';
        const filtered = this.data.filter(x => x.type === type || (type === 'anime' && x.type === 'anime'));
        filtered.forEach(item => this.createCard(item, grid));
    },

    renderSaved: function() {
        const grid = document.getElementById('saved-grid');
        grid.innerHTML = '';
        if(this.saved.length === 0) grid.innerHTML = '<div class="empty-state">No saved media.</div>';
        this.saved.forEach(item => this.createCard(item, grid));
    },

    createCard: function(item, container) {
        const card = document.createElement('div');
        card.className = 'media-card';
        const img = item.type === 'game' ? item.img : item.img;
        
        card.innerHTML = `
            <img src="${img}" alt="${item.title}">
            <div class="media-info">
                <div class="media-title">${item.title}</div>
            </div>
            <div class="play-overlay">
                <span class="play-btn">Play Now</span>
            </div>
        `;
        card.onclick = () => {
            this.currentItem = item;
            document.getElementById('ask-title').innerText = item.title;
            document.getElementById('ask-desc').innerText = item.desc;
            document.getElementById('ask-ui').classList.add('active');
        };
        container.appendChild(card);
    },

    saveToStorage: function() {
        if(Config.cookiesAllowed) localStorage.setItem('batprox_saved_media', JSON.stringify(this.saved));
    },

    loadSaved: function() {
        const s = localStorage.getItem('batprox_saved_media');
        if(s) { this.saved = JSON.parse(s); this.renderSaved(); }
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
        this.updateFavicon();
    },

    updateFavicon: function() {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 24'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:#3b82f6;stop-opacity:1' /><stop offset='100%' style='stop-color:#10b981;stop-opacity:1' /></linearGradient></defs><path d='M0 0 L10 24 L18 16 Z' fill='#a855f7'/><path d='M36 0 L26 24 L18 16 Z' fill='#a855f7'/><circle cx='18' cy='12' r='7' fill='url(#g)'/></svg>`;
        document.getElementById('dynamic-favicon').href = 'data:image/svg+xml;base64,' + btoa(svg);
    },

    handlers: function() {
        document.getElementById('menu-btn').onclick = () => document.getElementById('hub-layer').classList.add('visible');
        document.getElementById('hub-exit').onclick = () => document.getElementById('hub-layer').classList.remove('visible');
        
        const tabs = document.querySelectorAll('.tab-link');
        const pages = document.querySelectorAll('.hub-page');
        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            pages.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(`${t.dataset.view}-view`).classList.add('active');
        });

        document.getElementById('settings-btn').onclick = () => document.getElementById('settings-ui').classList.add('active');
        document.getElementById('settings-close').onclick = () => document.getElementById('settings-ui').classList.remove('active');
        
        document.getElementById('theme-selector').onchange = (e) => {
            this.applyTheme(e.target.value);
            Config.save('batprox_theme', e.target.value);
        };

        document.getElementById('ext-toggle').onchange = (e) => {
            Config.extensionsEnabled = e.target.checked;
            Config.save('batprox_ext', e.target.checked);
            BatProx.toggleExtensions(e.target.checked);
        };
        document.getElementById('ext-close').onclick = () => document.getElementById('ext-ui').classList.remove('active');
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

        const toggle = (id, state) => document.getElementById(id).style.display = state ? 'block' : 'none';
        
        toggle('starwars-layer', name === 'starwars');
        if(name === 'starwars') StarWarsEngine.enable(); else StarWarsEngine.disable();

        toggle('blossom-canvas', name === 'blossom');
        if(name === 'blossom') BlossomEngine.enable(); else BlossomEngine.disable();

        toggle('ocean-canvas', name === 'ocean');
        if(name === 'ocean') OceanEngine.enable(); else OceanEngine.disable();
        
        toggle('retro-grid', name === 'sunset');

        if(['void','ember','midnight','glitch','forest','gold','dracula','matrix','royal'].includes(name)) VaporEngine.enable(); else VaporEngine.disable();
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
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = 450; },
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
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; this.p = []; },
    loop: function() {
        if(!this.active) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0, 0, this.w, this.h);
        if(this.p.length < 50) {
            this.p.push({ x: Math.random()*this.w, y: -20, v: Math.random()*2+1, r: Math.random()*360, s: Math.random()*5+3 });
        }
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

const OceanEngine = {
    canvas: document.getElementById('ocean-canvas'),
    ctx: null, w: 0, h: 0, offset: 0, active: false,
    init: function() {
        this.ctx = this.canvas.getContext('2d');
        this.resize(); window.addEventListener('resize', () => this.resize());
        this.loop();
    },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; },
    loop: function() {
        if(!this.active) { requestAnimationFrame(() => this.loop()); return; }
        this.ctx.clearRect(0,0,this.w,this.h);
        this.offset += 0.02;
        
        for(let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.h);
            for(let x = 0; x < this.w; x += 10) {
                const y = Math.sin(x * 0.003 + this.offset + i) * 50 + (this.h * 0.7);
                this.ctx.lineTo(x, y);
            }
            this.ctx.lineTo(this.w, this.h);
            this.ctx.fillStyle = `rgba(59, 130, 246, ${0.1 + (i * 0.1)})`;
            this.ctx.fill();
        }
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

document.addEventListener('DOMContentLoaded', () => {
    BatProx.init();
    UI.init();
    WarpEngine.init();
    VaporEngine.init();
    BlossomEngine.init();
    OceanEngine.init();
});
