document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem("accessToken", data.session.access_token);
            localStorage.setItem("refreshToken", data.session.refresh_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // localStorage.setItem("profile", JSON.stringify(data.profile)); 
            window.location.href = "profile.html";
        }   

        else {
            console.error("Error:", data.error);
            alert("Sign-in error: " + data.error);
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to the server");
    }
});