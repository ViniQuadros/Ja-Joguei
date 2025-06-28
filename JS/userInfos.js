async function getUser() {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    try {
        const res = await fetch(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json()

        userName.textContent = `Usuário: ${user.name}`;
        userEmail.textContent = `Email: ${user.email}`;
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

function findFriends() {
    document.getElementById("meuModal").style.display = "block";
}

async function searchFriends() {
    const userId = localStorage.getItem("userId");
    const friendInput = document.getElementById("friendSearch");
    const friendName = friendInput.value;

    try {
        const res = await fetch(`http://localhost:3000/user/add/${userId}/${friendName}`, {
            method: "POST"
        });
        const data = await res.json(); // agora é JSON de verdade
        alert(data.message);
    } catch (error) {
        console.error("Erro ao adicionar amigo:", error);
        alert(`Erro ao tentar adicionar amigo: ${error}`);
    }
}

function closeModal() {
    document.getElementById("meuModal").style.display = "none";
}

async function getFriends() {
    const divFriends = document.getElementById("amigos");

    try {
        const res = await fetch(`http://localhost:3000/user/${localStorage.getItem("userId")}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json()
        divFriends.innerHTML = "";

        user.friends.forEach(friend => {
            const item = document.createElement("p");
            item.textContent = `${friend.name}`
            divFriends.appendChild(item);
        });
        
    } catch (error) {
        console.error("Erro ao tentar encontrar amigos:", error);
    }
}


document.addEventListener('DOMContentLoaded', updateProfilePic);
document.addEventListener('DOMContentLoaded', loadUserImg);
document.addEventListener('DOMContentLoaded', getUser);
document.addEventListener('DOMContentLoaded', getFriends);
