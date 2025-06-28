async function getUser() {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    try {
        const res = await fetch(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json()

        userName.textContent = user.name;
        userEmail.textContent = user.email;
    } catch (error) {
        console.error("Erro ao tentar encontrar usuário:", error);
    }
}

function updateProfilePic() {
    const img = document.getElementById("profilePic");
    const file = document.getElementById("changeImg");

    if (!img || !file) return;

    file.addEventListener("change", function (event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target.result;
                userImagem = e.target.result
                localStorage.setItem("userImg", userImagem)
            };

            reader.readAsDataURL(event.target.files[0]);
            location.reload();
        }
    });
}

function loadUserImg() {
    const img = document.getElementById("profilePic");
    img.src = localStorage.getItem("userImg");
}

document.addEventListener('DOMContentLoaded', updateProfilePic);
document.addEventListener('DOMContentLoaded', loadUserImg);
document.addEventListener('DOMContentLoaded', getUser);
