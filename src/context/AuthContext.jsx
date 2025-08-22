import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);


    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Logout: clear everything
    const logout = async () => {
        const token = localStorage.getItem("token");
        try {
            if (token) {

                await axios.post(
                    `${API_URL}/auth/logout`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error("Backend logout failed:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
