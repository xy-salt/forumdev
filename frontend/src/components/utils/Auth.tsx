import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";

interface JwtPayload {
    userID: number,
    exp: number,
}

export function getValidUserID(): number | null {
    const { token, logout } = useAuth();
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (Date.now() >= decoded.exp * 1000) {
            logout();
            return null;
        }
        return decoded.userID
    } catch {
        return null;
    }
}

const AuthContext = createContext<{
    token: string | null,
    login: (t: string) => void,
    logout: () => void,
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const login = (t: string) => {
        localStorage.setItem("token", t);
        setToken(t);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;