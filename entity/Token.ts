export type Token = string;
class TokenService {
    private TOKEN_KEY = "access_token";
    getToken() {
        if (!localStorage) return;
        const token: Token | null = localStorage.getItem(this.TOKEN_KEY);
        return token;
    }
    saveToken(token: Token) {
        if (!localStorage) return;
        localStorage.setItem(this.TOKEN_KEY, token);
    }
}
const tokenService = new TokenService();
export default tokenService;
