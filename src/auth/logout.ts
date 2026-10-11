// logout
const logoutBtn=document.querySelector<HTMLButtonElement>("#logoutBtn")
logoutBtn?.addEventListener("click",()=>{
    localStorage.removeItem("currentUser")
    window.location.replace("login.html")
})