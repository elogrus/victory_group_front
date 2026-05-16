import { CONSTS } from "@/lib/consts";
import { myFetch } from "@/lib/myFetch";
import { cookies } from "next/headers";

export type Token = string;
class TokenService {
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
        const res = await myFetch(this.ROUTES.verify);
        if (res.ok) return true;
        return false;
    }
}
const tokenService = new TokenService();
export default tokenService;
