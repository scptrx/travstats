import { isValidUsername, isValidPassword } from "./validation/validators.js";
import { showError, clearError, setupErrorClearOnInput } from "./utils/ui.js";
import { register } from "./utils/auth.js";

setupErrorClearOnInput("username", "email", "password");

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();

    clearError("username");
    clearError("email");
    clearError("password");

    let hasError = false;

    if (!isValidUsername(username)) {
        showError("username", "Username must be between 3 and 30 characters");
        hasError = true;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
        showError("password", passwordValidation.message);
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        const { res, data } = await register(email, password, username);

        if (res.ok) {
            window.location.href = "confirm-email.html";
        } else {
            const errorLower = data.error.toLowerCase();
            if (errorLower.includes("username")) {
                showError("username", data.error);
            } else if (errorLower.includes("email")) {
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
