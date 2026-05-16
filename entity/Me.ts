import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";

class MeService {
    private ROUTES = {
        login: CONSTS.API_URL + "/auth/token",
    };
    async login(login: string, password: string) {
        return await myFetch(this.ROUTES.login, {
            method: "POST",
            body: JSON.stringify({ login, password }),
        });
    }
}
const meService = new MeService();
export default meService;
