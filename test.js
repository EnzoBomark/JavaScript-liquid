const div = document.getElementById("div");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let particleArray = [];
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

const justX = Math.floor(window.innerWidth * 0.5 - 360);
const justY = 500;

ctx.font = 'bold 20px Roboto';
ctx.fillText('Enzo Bomark', 0, 25);
const data = ctx.getImageData(0, 0, 210, 25);

// Hande mouse
const mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x; 
        this.baseY = this.y;
        this.density = (Math.random() * 30 + 1);
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const foreceDirectionX = dx / distance;
        const foreceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = foreceDirectionX * force * this.density;
        const directionY = foreceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } 
        else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 50;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 30;
            }
        }
    }
}

function init(data) {
    particleArray = [];

    for (let y = 0, y2 = data.height; y < y2; y++) {
        for (let x = 0, x2 = data.width; x < x2; x++) {
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                let positionX = x;
                let positionY = y;
                particleArray.push(new Particle(positionX * 6 + justX, positionY * 6 + justY));
            }
        }
    }
}

init(data);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

animate();
