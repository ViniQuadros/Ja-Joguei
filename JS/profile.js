function updateProfileImg() {
    const profileImg = document.getElementById("profileImg");
    profileImg.src = localStorage.getItem("userImg")
}

function goToProfile() {
    const link = document.getElementById("profile");
    window.location.href = `/HTML/profile.html?user=${localStorage.getItem("userId")}`;
}

document.addEventListener('DOMContentLoaded', updateProfileImg);