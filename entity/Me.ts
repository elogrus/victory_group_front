import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";
import tokenService from "./Token";

class MeService {
    private ROUTES = {
        login: CONSTS.API_URL + "/auth/tokens",
    };
    async login(login: string, password: string) {
        const res = await myFetch<{ access_token: string; token_type: string }>(
            this.ROUTES.login,
            {
                method: "POST",
                body: JSON.stringify({ login, password }),
            },
        );
        if (res.ok) {
            tokenService.setToken(res.body.access_token);
        }
        return res;
    }
}
const meService = new MeService();
export default meService;
