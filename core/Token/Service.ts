import { cookies } from "next/headers";
import { Token, TokenRepo } from "./Repo";
import { CONSTS } from "@/lib/consts";
import ky from "ky";
class TokenService extends TokenRepo {
    private TOKEN_KEY = "token";
    private ROUTES = {
        verify: CONSTS.API_URL + "/verify",
    };
    async getToken() {
        const cookieStore = await cookies();
        const token = cookieStore.get(this.TOKEN_KEY)?.value as Token | null;

        return token;
    }
    async veryfyToken() {
        const res = await ky.post<boolean>(this.ROUTES.verify);
        if (res.ok && (await res.json())) return true;
        return false;
    }
}
const tokenService = new TokenService();
export default tokenService;
