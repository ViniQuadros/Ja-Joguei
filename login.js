setInterval(createDrop, 400);
function createDrop() {
    const container = document.getElementById("rain");
    const drop = document.createElement("img");
    drop.src = "/Images/Logo.ico";
    drop.classList.add("drop");

    const size = Math.random() * 30 + 20;
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;
    drop.style.left = `${Math.random() * window.innerWidth}px`
    drop.style.animationDuration = `${Math.random() * 3 + 2}s`

    container.appendChild(drop);

    setTimeout(() => container.removeChild(drop), 6000);
}

function register() {
    window.location.href = "registerPage.html";
}