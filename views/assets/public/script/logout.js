export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");

    window.location.href = "/Salon-Vision/index.html";
}