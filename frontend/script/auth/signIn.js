document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            console.log("Successful Sign-in:", data);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "profile.html";
        } else {
            console.error("Error:", data.error);
            alert("Sign-in error: " + data.error);
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to the server");
    }
});