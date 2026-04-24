let stars = [];
let infoCluster = [];
let rotationAngle = 0;

class Star {
    constructor(isInfo = false) {
        this.isInfo = isInfo;
        this.reset();
    }
    reset() {
        if (this.isInfo) {
            this.x = width - random(40, 130);
            this.y = height - random(40, 130);
            this.size = random(3, 6);
            this.color = color(0, 243, 255);
        } else {
            this.x = random(width);
            this.y = random(height);
            this.size = random(1, 3);
            this.color = color(255);
        }
        this.alpha = random(100, 255);
        this.blink = random(0.02, 0.05);
    }
    update() {
        this.alpha = 127 + 127 * sin(frameCount * this.blink);
        if (this.isInfo) this.x += sin(frameCount * 0.05) * 0.15;
    }
    display() {
        noStroke();
        fill(red(this.color), green(this.color), blue(this.color), this.alpha);
        circle(this.x, this.y, this.size);
        if (this.isInfo) {
            fill(0, 243, 255, 30);
            circle(this.x, this.y, this.size * 2.5);
        }
    }
}

function setup() {
    let cvs = createCanvas(windowWidth, windowHeight);
    cvs.id('p5-canvas');
    for (let i = 0; i < 150; i++) stars.push(new Star());
    for (let i = 0; i < 12; i++) infoCluster.push(new Star(true));
}

function draw() {
    clear();
    stars.forEach(s => { s.update(); s.display(); });
    infoCluster.forEach(s => { s.update(); s.display(); });
    
    fill(0, 243, 255, 180);
    textAlign(RIGHT);
    textSize(11);
    text("SYSTEM LOGS ❯", width - 50, height - 25);

    const screenD = document.getElementById('screen-d');
    if (screenD && !screenD.classList.contains('hidden')) drawReticle();
}

function drawReticle() {
    push();
    translate(width / 2, height / 2);
    rotate(rotationAngle);
    rotationAngle += 0.01;
    noFill();
    stroke(0, 243, 255, 150);
    strokeWeight(1.5);
    beginShape();
    for (let i = 0; i < 8; i++) {
        let ang = TWO_PI / 8 * i;
        let r = 180 + sin(frameCount * 0.1) * 10;
        vertex(cos(ang) * r, sin(ang) * r);
    }
    endShape(CLOSE);
    pop();
}

function mousePressed() {
    if (mouseX > width - 150 && mouseY > height - 150) toggleInfo();
}

function toggleInfo() {
    document.getElementById('info-panel').classList.toggle('hidden-panel');
}

// --- 完整的 9 顆星球資料鏈 ---
document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        { name: "Week 01", url: "https://ariel1120jj-sketch.github.io/20260223/", id: "Feb23", date: "Feb.23" },
        { name: "Week 02", url: "https://ariel1120jj-sketch.github.io/20260302-1/", id: "Mar02", date: "Mar.02" },
        { name: "Week 03", url: "https://ariel1120jj-sketch.github.io/20260309/", id: "Mar09", date: "Mar.09" },
        { name: "Week 04", url: "https://ariel1120jj-sketch.github.io/20260316/", id: "Mar16", date: "Mar.16" },
        { name: "Week 05", url: "https://ariel1120jj-sketch.github.io/20260323/", id: "Mar23", date: "Mar.23" },
        { name: "Week 06", url: "https://ariel1120jj-sketch.github.io/20260330/", id: "Mar30", date: "Mar.30" },
        { name: "Week 06-2", url: "https://ariel1120jj-sketch.github.io/20260330-2/", id: "Mar30-2", date: "Mar.30-2" },
        { name: "Week 07", url: "https://ariel1120jj-sketch.github.io/20260413/", id: "Apr13", date: "Apr.13" },
        { name: "Week 08", url: "https://ariel1120jj-sketch.github.io/20260420-2/", id: "Apr20", date: "Apr.20" }
    ];

    const selector = document.getElementById('planet-selector');
    projects.forEach((p) => {
        const div = document.createElement('div');
        div.className = 'planet-thumb';
        let svgW = (p.id === 'Mar30') ? 130 : 90;
        div.innerHTML = `
            <svg viewBox="0 0 100 100" width="${svgW}">
                <circle cx="50" cy="50" r="42" fill="url(#grad-${p.id})" filter="url(#planet-glow)" />
                ${p.id === 'Mar30' ? '<ellipse class="saturn-ring" cx="50" cy="50" rx="70" ry="15" transform="rotate(-15 50 50)" />' : ''}
                <circle cx="50" cy="50" r="42" fill="url(#grad-specular)" />
            </svg>
            <p class="planet-label">${p.date}</p>
        `;
        div.onclick = () => travel(p);
        selector.appendChild(div);
    });

    document.getElementById('start-btn').onclick = () => {
        document.getElementById('screen-a').classList.add('hidden');
        document.getElementById('screen-b').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('screen-b').classList.add('hidden');
            document.getElementById('screen-c').classList.remove('hidden');
        }, 1500);
    };

    window.travel = (p) => {
        document.getElementById('screen-c').classList.add('hidden');
        const focus = document.getElementById('focused-planet-area');
        focus.innerHTML = `
            <h2 class="title">${p.name}</h2>
            <svg viewBox="0 0 100 100" width="220">
                <circle cx="50" cy="50" r="45" fill="url(#grad-${p.id})" filter="url(#planet-glow)" />
                <circle cx="50" cy="50" r="45" fill="url(#grad-specular)" />
            </svg>
            <div style="margin-top:40px;"><button class="btn" onclick="openIframe('${p.url}')">進入座標</button></div>
        `;
        document.getElementById('screen-d').classList.remove('hidden');
    };

    window.openIframe = (url) => {
        document.getElementById('screen-d').classList.add('hidden');
        document.getElementById('main-frame').src = url;
        document.getElementById('main-display').classList.remove('hidden');
    };

    window.disconnect = () => {
        document.getElementById('main-display').classList.add('hidden');
        document.getElementById('screen-c').classList.remove('hidden');
    };
});

function windowResized() { resizeCanvas(windowWidth, windowHeight); }