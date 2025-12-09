const BatProx = {
    vm: document.getElementById('vm-interface'),
    frame: document.getElementById('vm-frame'),
    loader: document.querySelector('.vm-loader'),
    urlDisplay: document.getElementById('vm-url-text'),

    init: function() {
        const input = document.getElementById('master-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.route(input.value);
        });

        document.getElementById('vm-terminate').addEventListener('click', () => {
            this.kill();
        });
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
        this.urlDisplay.innerText = target;
        
        requestAnimationFrame(() => {
            this.loader.classList.add('loading');
        });

        this.frame.src = 'about:blank';

        const virtualDOM = `
            <!DOCTYPE html>
            <html style="height:100%;margin:0;overflow:hidden;">
            <head>
                <meta name="referrer" content="no-referrer">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="margin:0;height:100%;width:100%;overflow:hidden;background:#fff;">
                <iframe 
                    src="${target}" 
                    style="width:100%;height:100%;border:none;display:block;" 
                    allowfullscreen
                    allow="camera; microphone; fullscreen; payment"
                ></iframe>
            </body>
            </html>
        `;

        const blob = new Blob([virtualDOM], { type: 'text/html' });
        
        setTimeout(() => {
            this.frame.src = URL.createObjectURL(blob);
            setTimeout(() => {
                this.loader.style.opacity = '0';
            }, 600);
        }, 400); 
    },

    kill: function() {
        this.vm.classList.remove('active');
        this.loader.classList.remove('loading');
        this.loader.style.width = '0%';
        this.loader.style.opacity = '1';
        setTimeout(() => {
            this.frame.src = 'about:blank';
        }, 300);
    }
};

const WarpEngine = {
    canvas: document.getElementById('warp-canvas'),
    ctx: null,
    width: 0,
    height: 0,
    particles: [],
    
    start: function() {
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        for (let i = 0; i < 350; i++) {
            this.particles.push(this.spawn());
        }
        
        this.render();
    },

    resize: function() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    },

    spawn: function() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            z: Math.random() * this.width,
            sz: Math.random() * 2
        };
    },

    render: function() {
        this.ctx.fillStyle = "#030303";
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const cx = this.width / 2;
        const cy = this.height / 2;

        this.particles.forEach(p => {
            p.z -= 2; 
            
            if (p.z <= 0) {
                p.z = this.width;
                p.x = Math.random() * this.width;
                p.y = Math.random() * this.height;
            }

            const factor = 250 / (250 + p.z);
            const x = (p.x - this.width / 2) * factor + cx;
            const y = (p.y - this.height / 2) * factor + cy;
            const size = (1 - p.z / this.width) * 2.5 * p.sz;
            const alpha = (1 - p.z / this.width);

            if (x > 0 && x < this.width && y > 0 && y < this.height) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        requestAnimationFrame(() => this.render());
    }
};

const VaporEngine = {
    canvas: document.getElementById('vapor-canvas'),
    ctx: null,
    w: 0,
    h: 0,
    p: [],

    start: function() {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.loop();
    },

    resize: function() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = 400;
    },

    add: function() {
        const x = this.w / 2 + (Math.random() - 0.5) * 80;
        this.p.push({
            x: x,
            y: this.h + 50,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -(Math.random() * 2 + 1.5),
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            size: Math.random() * 25 + 10
        });
    },

    loop: function() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.globalCompositeOperation = 'screen';

        if (this.p.length < 150) {
            this.add();
            this.add();
        }

        for (let i = this.p.length - 1; i >= 0; i--) {
            let s = this.p[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;
            s.size += 0.2;

            if (s.life <= 0) {
                this.p.splice(i, 1);
            } else {
                const grad = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
                grad.addColorStop(0, `rgba(180, 180, 255, ${s.life * 0.3})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        requestAnimationFrame(() => this.loop());
    }
};

const UI = {
    init: function() {
        this.time();
        this.text();
        this.hub();
    },

    time: function() {
        const el = document.getElementById('clock-display');
        setInterval(() => {
            const d = new Date();
            let h = d.getHours();
            const ap = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            const m = d.getMinutes().toString().padStart(2, '0');
            const mo = (d.getMonth() + 1).toString().padStart(2, '0');
            const da = d.getDate().toString().padStart(2, '0');
            el.innerText = `${h}:${m} ${ap} - ${mo}/${da}/${d.getFullYear()}`;
        }, 1000);
    },

    text: function() {
        const el = document.getElementById('dynamic-text');
        const list = [
            "The best proxy of them all. Goes to BatProx.",
            "BatProx was made in 2024 but didn't work now it does and is rewritten.",
            "BatProx is its own and new proxy.",
            "Fastest of them all."
        ];
        let idx = 0;
        
        setInterval(() => {
            el.classList.add('text-cycle');
            setTimeout(() => {
                idx = (idx + 1) % list.length;
                el.innerText = list[idx];
                el.classList.remove('text-cycle');
            }, 300);
        }, 4000);
    },

    hub: function() {
        const layer = document.getElementById('hub-layer');
        const trigger = document.getElementById('menu-btn');
        const exit = document.getElementById('hub-exit');
        const tabs = document.querySelectorAll('.tab-link');
        const pages = document.querySelectorAll('.hub-page');

        trigger.onclick = () => layer.classList.add('visible');
        exit.onclick = () => layer.classList.remove('visible');

        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            pages.forEach(x => x.classList.remove('active'));
            
            t.classList.add('active');
            document.getElementById(`${t.dataset.view}-view`).classList.add('active');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    BatProx.init();
    WarpEngine.start();
    VaporEngine.start();
    UI.init();
});
