const Config = {
    cookiesAllowed: localStorage.getItem('batprox_consent') === 'true',
    extensionsAllowed: localStorage.getItem('batprox_ext') === 'true',
    
    themes: {
        void: { p: '#a855f7', rgb: '168, 85, 247', bg: '#030303', s: '#0a0a0a', t: '#ffffff' },
        blossom: { p: '#fbcfe8', rgb: '251, 207, 232', bg: '#1f1016', s: '#29151e', t: '#fce7f3' },
        starwars: { p: '#ffe81f', rgb: '255, 232, 31', bg: '#000000', s: '#111111', t: '#ffe81f' },
        ocean: { p: '#38bdf8', rgb: '56, 189, 248', bg: '#0c4a6e', s: '#075985', t: '#e0f2fe' },
        sunset: { p: '#f472b6', rgb: '244, 114, 182', bg: '#4a044e', s: '#701a75', t: '#fce7f3' },
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
        }
        if(this.extensionsAllowed) {
            document.getElementById('ext-toggle').checked = true;
            document.getElementById('vm-ext-btn').classList.remove('hidden');
        }
    }
};

const BatProx = {
    vm: document.getElementById('vm-interface'),
    frame: document.getElementById('vm-frame'),
    loader: document.querySelector('.vm-loader'),
    urlDisplay: document.getElementById('vm-url-text'),
    sidebar: document.getElementById('vm-sidebar'),

    init: function() {
        const input = document.getElementById('master-input');
        input.addEventListener('keydown', (e) => {
            e.stopPropagation(); 
            if (e.key === 'Enter') this.route(input.value);
        });

        document.getElementById('vm-terminate').addEventListener('click', () => this.kill());
        document.getElementById('vm-exit-browse').addEventListener('click', () => this.kill());
        
        document.getElementById('vm-sidebar-trigger').onclick = () => {
            const isActive = this.sidebar.classList.contains('active');
            if(isActive) this.sidebar.classList.remove('active');
            else this.sidebar.classList.add('active');
        };

        document.getElementById('side-menu-btn').onclick = () => {
            document.getElementById('hub-layer').classList.add('visible');
            document.getElementById('hub-layer').style.visibility = 'visible';
        };

        document.getElementById('side-settings-btn').onclick = () => {
            document.getElementById('settings-ui').classList.add('active');
            document.getElementById('settings-ui').style.visibility = 'visible';
        };

        document.getElementById('side-api-btn').onclick = () => {
            window.location.href = '/ourapi';
        };

        document.getElementById('vm-ext-btn').onclick = () => {
            document.getElementById('extension-ui').classList.add('active');
            document.getElementById('extension-ui').style.visibility = 'visible';
        };
    },

    route: function(raw) {
        if (!raw) return;
        let url = raw.trim();
        let finalTarget = '';
        
        // Multi-stage loading strategy
        // 1. If it looks like a URL, try direct (or via Google IGU gateway)
        // 2. If it's a search term, use Google IGU
        if (url.includes('.') && !url.includes(' ')) {
             if (!url.startsWith('http')) url = 'https://' + url;
             // Google IGU Bypass
             finalTarget = `https://www.google.com/search?igu=1&q=site:${encodeURIComponent(url)}`;
        } else {
             finalTarget = `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
        }

        this.boot(finalTarget, url);
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
            <body style="margin:0;height:100%;overflow:hidden;background:#fff;">
                <iframe src="${target}" style="width:100%;height:100%;border:none;" referrerpolicy="no-referrer" allowfullscreen sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups allow-modals allow-presentation"></iframe>
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

const MediaLibrary = {
    data: [
        { title: "Five Nights at Freddy's", img: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRn46.jpg", id: "507089", type: "movie", desc: "A troubled security guard begins working at Freddy Fazbear's Pizza." },
        { title: "Five Nights at Freddy's 2", img: "https://image.tmdb.org/t/p/w500/tF1h8bH0Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1.jpg", id: "1058694", type: "movie", desc: "The sequel to the hit horror movie based on the video game." },
        { title: "Deadpool & Wolverine", img: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", id: "533535", type: "movie", desc: "Deadpool joins forces with Wolverine." },
        { title: "Inside Out 2", img: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", id: "1022789", type: "movie", desc: "Riley's mind headquarters is undergoing a sudden demolition to make room for new emotions." },
        { title: "1v1.lol (Unblocked)", img: "https://play-lh.googleusercontent.com/1-hPxk_z2_q-E-1-1-1-1-1-1-1.png", id: "game1", type: "game", url: "https://1v1.lol", desc: "Build and shoot in this battle royale game." },
        { title: "One Piece", img: "https://image.tmdb.org/t/p/w500/cMD9Ygz11VJmK195pWr35Hsy723.jpg", id: "37854", type: "anime", desc: "Monkey D. Luffy sails the seas to become the King of Pirates." }
    ],
    saved: [],
    currentItem: null,

    init: function() {
        this.render('movie');
        document.getElementById('media-type-selector').onchange = (e) => this.render(e.target.value);
        
        document.getElementById('ask-close').onclick = () => {
            document.getElementById('ask-first-ui').classList.remove('active');
        };
        
        document.getElementById('ask-play').onclick = () => {
            document.getElementById('ask-first-ui').classList.remove('active');
            this.launch(this.currentItem);
        };

        document.getElementById('ask-save').onclick = () => {
            if(!this.saved.find(x => x.id === this.currentItem.id)) {
                this.saved.push(this.currentItem);
                this.saveToStorage();
                this.renderSaved();
                document.getElementById('ask-save').innerText = 'Saved!';
            }
        };
    },

    render: function(type) {
        const grid = document.getElementById(type === 'game' ? 'games-grid' : 'movies-grid');
        grid.innerHTML = '';
        const list = type === 'game' ? this.data.filter(x => x.type === 'game') : this.data.filter(x => x.type === type || (type === 'all') || (type === 'anime' && x.type === 'anime'));
        
        if(list.length === 0) grid.innerHTML = '<div class="empty-state">No items found.</div>';

        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `<img src="${item.img}" alt="${item.title}"><div class="media-type">${item.type.toUpperCase()}</div><div class="media-info"><div class="media-title">${item.title}</div></div>`;
            card.onclick = () => this.openAskUI(item);
            grid.appendChild(card);
        });
    },

    openAskUI: function(item) {
        this.currentItem = item;
        document.getElementById('ask-title').innerText = item.title;
        document.getElementById('ask-desc').innerText = item.desc || "No description available.";
        document.getElementById('ask-poster').style.backgroundImage = `url('${item.img}')`;
        document.getElementById('ask-save').innerText = this.saved.find(x => x.id === item.id) ? 'Saved' : 'Save to List';
        document.getElementById('ask-first-ui').classList.add('active');
        document.getElementById('ask-first-ui').style.visibility = 'visible';
    },

    launch: function(item) {
        if(item.type === 'game') {
            BatProx.boot(item.url, item.title);
        } else {
            const url = `https://vidking.net/embed/${item.type}/${item.id}`;
            BatProx.boot(url, item.title);
            
            // Simulate episode end after a long duration for "Next Episode" UI
            setTimeout(() => {
                document.getElementById('next-ep-ui').classList.add('active');
                document.getElementById('next-ep-ui').style.visibility = 'visible';
            }, 600000); // 10 minutes demo
        }
    },

    renderSaved: function() {
        const grid = document.getElementById('saved-grid');
        grid.innerHTML = '';
        if(this.saved.length === 0) { grid.innerHTML = '<div class="empty-state">No saved media.</div>'; return; }
        this.saved.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `<img src="${item.img}" alt="${item.title}"><div class="media-info"><div class="media-title">${item.title}</div></div>`;
            card.onclick = () => this.openAskUI(item);
            grid.appendChild(card);
        });
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
        MediaLibrary.render('game'); // Init games
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
            localStorage.setItem('batprox_ext', e.target.checked);
            Config.extensionsAllowed = e.target.checked;
            if(e.target.checked) document.getElementById('vm-ext-btn').classList.remove('hidden');
            else document.getElementById('vm-ext-btn').classList.add('hidden');
        };

        document.getElementById('ext-close').onclick = () => { document.getElementById('extension-ui').classList.remove('active'); };
        document.getElementById('next-cancel').onclick = () => { document.getElementById('next-ep-ui').classList.remove('active'); };
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

        document.getElementById('starwars-layer').style.display = name === 'starwars' ? 'block' : 'none';
        if(name === 'starwars') StarWarsEngine.enable(); else StarWarsEngine.disable();

        document.getElementById('blossom-canvas').style.display = name === 'blossom' ? 'block' : 'none';
        if(name === 'blossom') BlossomEngine.enable(); else BlossomEngine.disable();

        document.getElementById('ocean-layer').style.display = name === 'ocean' ? 'block' : 'none';
        document.getElementById('retro-layer').style.display = name === 'sunset' ? 'block' : 'none';

        if(name !== 'blossom' && name !== 'starwars' && name !== 'ocean' && name !== 'sunset') VaporEngine.enable(); else VaporEngine.disable();
    },

    cookies: function() {
        if(!localStorage.getItem('batprox_consent')) setTimeout(() => document.getElementById('cookie-consent').classList.add('show'), 1000);
        document.getElementById('cookie-yes').onclick = () => {
            localStorage.setItem('batprox_consent', 'true'); Config.cookiesAllowed = true;
            document.getElementById('cookie-consent').classList.remove('show');
        };
        document.getElementById('cookie-no').onclick = () => {
            localStorage.setItem('batprox_consent', 'false'); Config.cookiesAllowed = false;
            document.getElementById('cookie-consent').classList.remove('show');
        };
    },

    clock: function() {
        const el = document.getElementById('clock-display');
        setInterval(() => {
            const d = new Date();
            let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
            const m = d.getMinutes().toString().padStart(2, '0');
            const s = d.getSeconds().toString().padStart(2, '0');
            const mo = (d.getMonth()+1).toString().padStart(2, '0');
            const da = d.getDate().toString().padStart(2, '0');
            el.innerText = `${h}:${m}:${s} ${ap} - ${mo}/${da}/${d.getFullYear()}`;
        }, 1000);
    },

    text: function() {
        const el = document.getElementById('dynamic-text');
        const msgs = ["The best proxy of them all. Goes to BatProx.", "BatProx was made in 2024 but didn't work now it does and is rewritten.", "BatProx is its own and new proxy.", "Fastest of them all."];
        let i = 0;
        setInterval(() => {
            el.classList.add('text-cycle');
            setTimeout(() => { i = (i + 1) % msgs.length; el.innerText = msgs[i]; el.classList.remove('text-cycle'); }, 300);
        }, 4000);
    }
};

const WarpEngine = {
    canvas: document.getElementById('warp-canvas'), ctx: null, w: 0, h: 0, p: [],
    init: function() { this.ctx = this.canvas.getContext('2d', {alpha:false}); this.resize(); window.addEventListener('resize', ()=>this.resize()); for(let i=0;i<300;i++)this.spawn(); this.loop(); },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    spawn: function() { this.p.push({ x:(Math.random()-0.5)*this.w*2, y:(Math.random()-0.5)*this.h*2, z:Math.random()*this.w, sz:Math.random() }); },
    loop: function() {
        this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor; this.ctx.fillRect(0,0,this.w,this.h);
        const cx=this.w/2, cy=this.h/2;
        this.p.forEach(p=>{
            p.z-=1.5; if(p.z<=0){p.z=this.w;p.x=(Math.random()-0.5)*this.w*2;p.y=(Math.random()-0.5)*this.h*2;}
            const k=250/(250+p.z), x=p.x*k+cx, y=p.y*k+cy, s=(1-p.z/this.w)*3*p.sz, a=(1-p.z/this.w);
            if(x>0&&x<this.w&&y>0&&y<this.h){ this.ctx.fillStyle=`rgba(255,255,255,${a})`; this.ctx.beginPath(); this.ctx.arc(x,y,s,0,Math.PI*2); this.ctx.fill(); }
        });
        requestAnimationFrame(()=>this.loop());
    }
};

const VaporEngine = {
    canvas: document.getElementById('vapor-canvas'), ctx: null, w: 0, h: 0, p: [], active: true,
    init: function() { this.ctx = this.canvas.getContext('2d',{alpha:true}); this.resize(); window.addEventListener('resize',()=>this.resize()); this.loop(); },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = 450; },
    enable: function() { this.active = true; }, disable: function() { this.active = false; this.p = []; this.ctx.clearRect(0,0,this.w,this.h); },
    loop: function() {
        if(!this.active){requestAnimationFrame(()=>this.loop());return;}
        this.ctx.clearRect(0,0,this.w,this.h);
        const style = getComputedStyle(document.documentElement);
        const rgb = style.getPropertyValue('--primary-rgb').trim() || '168, 85, 247';
        if(this.p.length<130) this.p.push({x:this.w/2+(Math.random()-0.5)*110, y:this.h+20, v:Math.random()*2+1, s:Math.random()*30+5, l:1});
        this.p.forEach((p,i)=>{
            p.y-=p.v; p.l-=0.009; p.x+=Math.sin(p.y*0.05)*0.5;
            if(p.l<=0) this.p.splice(i,1);
            const r = Math.max(0.1, p.s);
            this.ctx.beginPath();
            const g=this.ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
            g.addColorStop(0,`rgba(255,255,255,${Math.max(0,p.l*0.7)})`);
            g.addColorStop(0.4,`rgba(${rgb},${Math.max(0,p.l*0.5)})`);
            g.addColorStop(1,'rgba(0,0,0,0)');
            this.ctx.fillStyle=g; this.ctx.arc(p.x,p.y,r,0,Math.PI*2); this.ctx.fill();
        });
        requestAnimationFrame(()=>this.loop());
    }
};

const BlossomEngine = {
    canvas: document.getElementById('blossom-canvas'), ctx: null, w: 0, h: 0, p: [], active: false,
    init: function() { this.ctx = this.canvas.getContext('2d'); this.resize(); window.addEventListener('resize',()=>this.resize()); this.loop(); },
    resize: function() { this.w = this.canvas.width = window.innerWidth; this.h = this.canvas.height = window.innerHeight; },
    enable: function() { this.active = true; this.canvas.style.display = 'block'; },
    disable: function() { this.active = false; this.canvas.style.display = 'none'; this.p = []; },
    loop: function() {
        if(!this.active){requestAnimationFrame(()=>this.loop());return;}
        this.ctx.clearRect(0,0,this.w,this.h);
        if(this.p.length<50) this.p.push({x:Math.random()*this.w, y:-20, v:Math.random()*2+1, r:Math.random()*360, s:Math.random()*5+3});
        this.p.forEach((p,i)=>{
            p.y+=p.v; p.x+=Math.sin(p.y*0.01); p.r+=1;
            if(p.y>this.h) this.p.splice(i,1);
            this.ctx.save(); this.ctx.translate(p.x,p.y); this.ctx.rotate(p.r*Math.PI/180);
            this.ctx.fillStyle='#fbcfe8'; this.ctx.beginPath(); this.ctx.ellipse(0,0,p.s,p.s/2,0,0,Math.PI*2); this.ctx.fill(); this.ctx.restore();
        });
        requestAnimationFrame(()=>this.loop());
    }
};

const StarWarsEngine = {
    layer: document.getElementById('starwars-layer'), active: false, interval: null,
    enable: function() { if(this.active)return; this.active=true; this.layer.style.display='block'; this.spawnLoop(); },
    disable: function() { this.active=false; this.layer.style.display='none'; this.layer.innerHTML=''; if(this.interval)clearInterval(this.interval); },
    spawnLoop: function() { this.interval=setInterval(()=>{if(this.active)this.spawnShip();},3000); },
    spawnShip: function() {
        const ship = document.createElement('div'); ship.classList.add('tie-fighter');
        ship.innerHTML = '<div class="tie-wing-l"></div><div class="tie-wing-r"></div><div class="tie-center"><div class="tie-window"></div></div>';
        const size=0.5+Math.random(), topPos=Math.random()*90, duration=Math.random()*5+10;
        ship.style.transform=`scale(${size}) rotate(90deg)`; ship.style.top=`${topPos}%`; ship.style.left='-100px';
        ship.style.transition=`left ${duration}s linear`;
        this.layer.appendChild(ship);
        setTimeout(()=>ship.style.left='110%',50);
        setTimeout(()=>{if(ship.parentNode)ship.parentNode.removeChild(ship);},duration*1000);
    }
};

document.addEventListener('DOMContentLoaded', () => { BatProx.init(); UI.init(); WarpEngine.init(); VaporEngine.init(); BlossomEngine.init(); });
