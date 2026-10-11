import { loginUser } from "./auth.js";

// login
const loginForm = document.querySelector<HTMLFormElement>("#loginForm")
const loginMessage = document.querySelector<HTMLParagraphElement>("#message")


loginForm?.addEventListener("submit", (e) => {
    const emailInput = document.querySelector<HTMLInputElement>("#email")
    const passwordInput = document.querySelector<HTMLInputElement>("#password")
    e.preventDefault();
    if (emailInput && passwordInput) {
        const result = loginUser(
            emailInput?.value.trim(),
            passwordInput?.value
        )
        if (loginMessage) {
            loginMessage.textContent = result.message
            loginMessage.style.color=result.success?"green":"red"

            setTimeout(()=>{
                loginMessage.textContent=""
            },3000)
        }
        if(result.success && result.user){
            localStorage.setItem("currentUser",JSON.stringify(result.user))
            if(result.user.role==="admin"){
                window.location.replace("admin.html")
            }else{
                window.location.replace("products.html")
            }
        }
    }

})

