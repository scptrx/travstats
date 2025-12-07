// Валидация username (3-30 символов)
function isValidUsername(username) {
    return username.length >= 3 && username.length <= 30;
}

// Валидация пароля (минимум 8 символов, заглавная буква, цифра, спецсимвол)
function isValidPassword(password) {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character" };
    }
    return { valid: true };
}

// Функция для отображения ошибки
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.style.borderColor = "red";
    
    // Удаляем старое сообщение об ошибке, если есть
    const oldError = input.parentElement.querySelector(".error-message");
    if (oldError) {
        oldError.remove();
    }
    
    // Добавляем новое сообщение об ошибке
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.9em";
    errorDiv.style.marginTop = "5px";
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

// Функция для очистки ошибок
function clearError(inputId) {
    const input = document.getElementById(inputId);
    input.style.borderColor = "";
    
    const errorMsg = input.parentElement.querySelector(".error-message");
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Очистка ошибок при вводе
document.getElementById("username").addEventListener("input", () => clearError("username"));
document.getElementById("email").addEventListener("input", () => clearError("email"));
document.getElementById("password").addEventListener("input", () => clearError("password"));

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();
    
    // Очищаем предыдущие ошибки
    clearError("username");
    clearError("email");
    clearError("password");
    
    let hasError = false;
    
    // Валидация username
    if (!isValidUsername(username)) {
        showError("username", "Username must be between 3 and 30 characters");
        hasError = true;
    }
    
    // Валидация пароля
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
        showError("password", passwordValidation.message);
        hasError = true;
    }
    
    // Если есть ошибки валидации, не отправляем запрос
    if (hasError) {
        return;
    }
    
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
            // Показываем ошибки с сервера
            if (data.error.toLowerCase().includes("username")) {
                showError("username", data.error);
            } else if (data.error.toLowerCase().includes("email")) {
                showError("email", data.error);
            } else if (data.error.toLowerCase().includes("password")) {
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