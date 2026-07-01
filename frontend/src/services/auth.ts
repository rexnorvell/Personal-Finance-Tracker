export const isAuthenticated = () => {
    return localStorage.getItem("auth") === "true";
};