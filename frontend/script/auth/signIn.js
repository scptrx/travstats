import { isValidEmail } from './validation/validators.js';
import { showError, clearError, setupErrorClearOnInput } from './utils/ui.js';
import { checkAuthAndRedirect, login, saveAuth } from './utils/auth.js';

checkAuthAndRedirect();

setupErrorClearOnInput("email", "password");

document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    
    clearError("email");
    clearError("password");
    
    if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address");
        return;
    }
    
    try {
        const { res, data } = await login(email, password);
        
        if (res.ok) {
            saveAuth(data.session, data.user);
            window.location.href = "profile.html";
        } else {
            const errorLower = data.error.toLowerCase();
            if (errorLower.includes("email") || errorLower.includes("user")) {
                showError("email", data.error);
            } else if (errorLower.includes("password")) {
                showError("password", data.error);
            } else {
                showError("email", data.error);
            }
        }
    } catch (error) {
        console.error("Request error:", error);
        showError("email", "Failed to connect to the server");
    }
});