// register
export type User = {
    id: number,
    name: string,
    email: string,
    password: string,
    role: "admin" | "user";
}

const ADMIN_CODE = "ADMIN@123"

export type RegisterResult = {
    success: boolean,
    message: string
}

export function registerUser(name: string, email: string, password: string, admincode: string): RegisterResult {
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

export function saveUsers(users: User[]): void {
    localStorage.setItem("users", JSON.stringify(users))
}

export function getUsers(): User[] {
    const data = localStorage.getItem("users")
    if (!data) return []

    return JSON.parse(data) as User[];
}

// login
export type LoginResult = {
    success: boolean,
    message: string,
    user?: User
}

export function loginUser(email: string, password: string): LoginResult {
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
