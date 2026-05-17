class TokenService {
    private TOKEN_KEY = "access_token";

    getToken() {
        // Проверяем, что код выполняется в браузере
        if (typeof window === "undefined") {
            return null;
        }
        
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            return token;
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            return null;
        }
    }

    setToken(token: string) {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    removeToken() {
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }
}

const tokenService = new TokenService();
export default tokenService;