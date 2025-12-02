function checkUserStatus() {
    const token = localStorage.getItem("accessToken");
    const signInDiv = document.getElementById("sign-in");
    
    if (token) {
        signInDiv.innerHTML = `
            <button id="profileButton" type="button" onclick="window.location.href='pages/profile.html'">My Profile</button>
        `;
    } else {
        return;
    }
}

document.addEventListener("DOMContentLoaded", checkUserStatus);