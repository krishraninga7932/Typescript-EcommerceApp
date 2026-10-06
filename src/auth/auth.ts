// register
type User = {
    id: number,
    name: string,
    email: string,
    password: string,
    role: "admin" | "user";
}

const ADMIN_CODE = "ADMIN@123"

type RegisterResult = {
    success: boolean,
    message: string
}

function registerUser(name: string, email: string, password: string, admincode: string): RegisterResult {
    const users = getUsers()
    if (admincode !== "" && admincode !== ADMIN_CODE) {
        return {
            success: false,
            message: "Invalid admin code"
        }
    }

    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
        return {
            success: false,
            message: "Email already registered"
        }
    }

    const newUser: User = {
        id: Date.now(),
        name,
        email,
        password,
        role: admincode === "" ? "user" : "admin"

    }
    users.push(newUser)
    saveUsers(users)

    return {
        success: true,
        message: "Registration Successfull"
    }


}




function saveUsers(users: User[]): void {
    localStorage.setItem("users", JSON.stringify(users))
}

function getUsers(): User[] {
    const data = localStorage.getItem("users")
    if (!data) return []

    return JSON.parse(data) as User[];
}


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



// login
type LoginResult = {
    success: boolean,
    message: string,
    user?: User
}
function loginUser(email: string, password: string): LoginResult {
    const users = getUsers()
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return {
            success: false,
            message: "Invalid email or password"
        }
    }
    return {
        success: true,
        message: "Login Successfully",
        user: user
    }
}


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
                window.location.href="admin.html"
            }else{
                window.location.href="products.html"
            }
        }
    }

})







export {
    registerUser,
    saveUsers,
    getUsers,
    loginUser
}
export type {
    User,
    RegisterResult,
    LoginResult
}