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
    window.location.href = "/HTML/registerPage.html";
}

async function cadastrar() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('nome').value.trim();
    const password = document.getElementById('senha').value.trim();
    const emailConfirm = document.getElementById('emailConfirm').value.trim();
    const senhaConfirm = document.getElementById('senhaConfirm').value.trim();

    if (email !== emailConfirm || password !== senhaConfirm) {
        document.getElementById('response').innerText = "Email ou senha não coincidem.";
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        window.location.href = "loginPage.html";

    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    }
}

async function entrar() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('senha').value.trim();

    if (!email || !password) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/user/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.status === "SUCESSO") {
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userEmail", data.email);
            window.location.href = "/HTML/personalPage.html";
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        console.error("Erro ao tentar logar:", error);
        alert("Erro ao conectar com o servidor.");
    }
}


