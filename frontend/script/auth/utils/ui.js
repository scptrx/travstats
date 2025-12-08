export function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.style.borderColor = "red";
    
    const oldError = input.parentElement.querySelector(".error-message");
    if (oldError) {
        oldError.remove();
    }
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.9em";
    errorDiv.style.marginTop = "5px";
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

export function clearError(inputId) {
    const input = document.getElementById(inputId);
    input.style.borderColor = "";
    
    const errorMsg = input.parentElement.querySelector(".error-message");
    if (errorMsg) {
        errorMsg.remove();
    }
}

export function setupErrorClearOnInput(...inputIds) {
    inputIds.forEach(inputId => {
        document.getElementById(inputId).addEventListener("input", () => clearError(inputId));
    });
}