import type { User } from "./auth.js";

function guardPage(): void {
    const currentPage = window.location.pathname.split("/").pop();

    const currentUserData = localStorage.getItem("currentUser");

    const protectedPages = ["admin.html", "products.html", "cart.html"];

    if (!protectedPages.includes(currentPage ?? "")) return;

    if (!currentUserData) {
        window.location.replace("login.html");
        return;
    }

    let currentUser: User;

    try {
        currentUser = JSON.parse(currentUserData) as User;
    } catch {
        localStorage.removeItem("currentUser");
        window.location.replace("login.html");
        return;
    }

    if (
        !currentUser ||
        typeof currentUser.id !== "number" ||
        (currentUser.role !== "admin" && currentUser.role !== "user")
    ) {
        localStorage.removeItem("currentUser");
        window.location.replace("login.html");
        return;
    }

    if (currentUser.role === "admin" && currentPage !== "admin.html") {
        window.location.replace("admin.html");
        return;
    }

    if (currentUser.role === "user" && currentPage === "admin.html") {
        window.location.replace("products.html");
        return;
    }
}

window.addEventListener("pageshow", () => {
    guardPage();
});

export { guardPage };