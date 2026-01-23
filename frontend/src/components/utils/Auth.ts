import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    userID: number,
    exp: number,
}

function getValidUserID(): number | null {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (Date.now() >= decoded.exp * 1000) {
            localStorage.removeItem("token");
            return null;
        }
        return decoded.userID
    } catch {
        return null;
    }
}

export default getValidUserID;