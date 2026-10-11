import { registerUser } from "./auth.js";

// registration form
const registrationForm = document.querySelector<HTMLFormElement>("#registerationForm")

const isAdmin = document.querySelector<HTMLInputElement>("#isAdmin")

const adminCodeContainer = document.querySelector<HTMLDivElement>("#adminCodeContainer")

const adminCodeInput = document.querySelector<HTMLInputElement>("#adminCode");

const message = document.querySelector<HTMLParagraphElement>("#message");

// admin check
isAdmin?.addEventListener("change", () => {
    if (isAdmin.checked) {
        if (adminCodeContainer) {
            adminCodeContainer.style.display = "block";
        }
    } else {
        if (adminCodeContainer) {
            adminCodeContainer.style.display = "none";
        }
        if (adminCodeInput) {
            adminCodeInput.value = "";
        }
    }
})

registrationForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.querySelector<HTMLInputElement>("#name");

    const emailInput = document.querySelector<HTMLInputElement>("#email");

    const passwordInput = document.querySelector<HTMLInputElement>("#password");

    if (nameInput && emailInput && passwordInput) {

        const result = registerUser(
            nameInput.value.trim(),
            emailInput.value.trim(),
            passwordInput.value,
            adminCodeInput ? adminCodeInput.value : ""
        );

        if (message) {
            message.textContent = result.message;
            message.style.color = result.success ? "green" : "red"

            setTimeout(() => {
                message.textContent = ""
            }, 3000)
        }

        if (result.success) {
            registrationForm.reset();

            if (adminCodeContainer) {
                adminCodeContainer.style.display = "none";
            }

            window.location.href="login.html"
        }
    }
})