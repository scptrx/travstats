// Проверка токена при загрузке страницы
if (localStorage.getItem("accessToken")) {
    // Проверяем валидность токена
    fetch("http://localhost:3000/auth/check", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
    .then(res => {
        if (res.ok) {
            window.location.href = "profile.html";
        } else {
            // Токен невалиден, очищаем localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    })
    .catch(err => {
        console.error("Token check error:", err);
    });
}

// Валидация email формата
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
document.getElementById("email").addEventListener("input", () => clearError("email"));
document.getElementById("password").addEventListener("input", () => clearError("password"));

document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    
    // Очищаем предыдущие ошибки
    clearError("email");
    clearError("password");
    
    // Валидация email формата
    if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address");
        return;
    }
    
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
            window.location.href = "profile.html";
        } else {
            // Показываем ошибки с сервера
            if (data.error.toLowerCase().includes("email") || data.error.toLowerCase().includes("user")) {
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