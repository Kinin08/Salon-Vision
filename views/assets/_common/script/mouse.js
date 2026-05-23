const cursor = document.getElementById("cursor");
const numberClientes = document.getElementById("numberClientes");
numberClientes.innerHTML = 1;

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

let scale = 1;
let targetScale = 1;

let color = [255, 204, 127];
let targetColor = [252, 218, 167];

let isGlass = false;

let width = 14;
let height = 14;

document.addEventListener("mousemove", (e) => {
    cursor.style.opacity = "1";
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.querySelectorAll("button, a").forEach(el => {
    el.addEventListener("mouseenter", () => {
        targetScale = 2;
        isGlass = true;
    });

    el.addEventListener("mouseleave", () => {
        targetScale = 1;
        isGlass = false;
    });
});
document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, input").forEach(el => {
    el.addEventListener("mouseenter", () => {
        width = 5.5 ;
        height = 24;
    });

    el.addEventListener("mouseleave", () => {
        width = 14;
        height = 14;
    });
});

function animate() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;

    scale += (targetScale - scale) * 0.15;

    cursor.style.transform =
        `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    cursor.style.width = `${width}px`;
    cursor.style.height = `${height}px`;
    if (isGlass) {
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        cursor.style.backdropFilter = "blur(14px)";
        cursor.style.webkitBackdropFilter = "blur(14px)";
        cursor.style.border = "1px solid rgba(255,255,255,0.05)";
        cursor.style.borderRadius = "9999px";
        cursor.style.boxShadow = "0 0 20px rgba(255,255,255,0.05)";
    } else {
        cursor.style.backgroundColor = "rgb(255, 204, 127)";
        cursor.style.backdropFilter = "none";
        cursor.style.border = "none";
        cursor.style.boxShadow = "0 0 15px rgba(255,204,127,0.6)";
    }

    requestAnimationFrame(animate);
}

animate();
lucide.createIcons();