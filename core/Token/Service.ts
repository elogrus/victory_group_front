import { cookies } from "next/headers";
import { Token, TokenRepo } from "./Repo";
class TokenService extends TokenRepo {
    private TOKEN_KEY = "token";
    async getToken() {
        const cookieStore = await cookies();
        const token = cookieStore.get(this.TOKEN_KEY)?.value as Token | null;

        return token;
    }
}
const tokenService = new TokenService();
export default tokenService;
