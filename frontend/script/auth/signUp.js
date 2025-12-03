document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    
    try {
        const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password, username })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            window.location.href = "confirm-email.html";
        } else {
            console.error("Error:", data.error);
            alert("Registration error: " + data.error);
        }
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to connect to the server");
    }
});